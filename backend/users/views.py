from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer, CounsellingRequestSerializer, StudentCollegeRegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            data = UserSerializer(user).data
            data['token'] = token.key
            if user.role == 'college_admin':
                try:
                    profile = user.college_profile
                    data['college_id'] = profile.college.id
                except Exception:
                    data['college_id'] = None
            elif user.role == 'student':
                try:
                    profile = user.student_profile
                    data['college_id'] = profile.college_id if profile.college else None
                except Exception:
                    data['college_id'] = None
            return Response(data)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class CounsellingRequestCreateView(generics.CreateAPIView):
    serializer_class = CounsellingRequestSerializer
    permission_classes = [AllowAny]

from .verification import verify_student_documents
from colleges.models import College

class StudentCollegeRegisterView(generics.CreateAPIView):
    serializer_class = StudentCollegeRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # 1. First, validate basics (usernames, passwords, formatting)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. Extract files and form data for OCR verification
        marksheet = request.FILES.get('marksheet_first_year')
        fees_receipt = request.FILES.get('fees_receipt')
        
        college_id = request.data.get('college')
        try:
            college_obj = College.objects.get(id=college_id)
            college_name = college_obj.name
        except College.DoesNotExist:
            return Response({'error': 'Selected college does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
        form_data = {
            'first_name': request.data.get('first_name'),
            'middle_name': request.data.get('middle_name'),
            'last_name': request.data.get('last_name'),
            'college_name': college_name,
            'degree_type': request.data.get('degree_type'),
            'branch': request.data.get('branch')
        }
        
        # 3. Perform OCR Verification
        verification_results = verify_student_documents(marksheet, fees_receipt, form_data)
        
        if verification_results['status'] != 'Verified':
            # Return detailed mismatched errors to the frontend pop-up
            return Response({
                'error': 'Verification Failed', 
                'details': verification_results['errors'],
                'ocr_data': verification_results
            }, status=status.HTTP_400_BAD_REQUEST)

        # 4. If verified, save the user and profile
        user = serializer.save()
        
        # Update the profile with the OCR verification data
        if hasattr(user, 'student_profile'):
            profile = user.student_profile
            profile.verification_data = verification_results
            profile.verification_status = 'Verified'
            profile.save()
            
        token, created = Token.objects.get_or_create(user=user)
        data = UserSerializer(user).data
        data['token'] = token.key
        data['college_id'] = user.student_profile.college_id
        
        return Response(data, status=status.HTTP_201_CREATED)

import pandas as pd
import numpy as np
import os
import joblib
import time
import logging

logger = logging.getLogger(__name__)

# ── ML Model & Encoders (loaded once, kept in memory) ────────
_ML_MODEL = None
_LABEL_ENCODERS = None
_COLLEGES_DF = None

MODEL_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "ml_model"
)


def _load_model():
    """Load the Random Forest model into memory (once, on first request)."""
    global _ML_MODEL
    if _ML_MODEL is None:
        model_path = os.path.join(MODEL_DIR, "random_forest_(ultra)_model.pkl")
        logger.info("Loading Random Forest model (~2.8 GB) — this may take a moment...")
        t0 = time.time()
        _ML_MODEL = joblib.load(model_path)
        logger.info(f"Model loaded in {time.time()-t0:.1f}s")
    return _ML_MODEL


def _load_encoders():
    """Load the label encoders into memory (once)."""
    global _LABEL_ENCODERS
    if _LABEL_ENCODERS is None:
        encoders_path = os.path.join(MODEL_DIR, "label_encoders.pkl")
        _LABEL_ENCODERS = joblib.load(encoders_path)
    return _LABEL_ENCODERS


def _load_colleges():
    """Load the unique (institute, program) combinations (once)."""
    global _COLLEGES_DF
    if _COLLEGES_DF is None:
        data_path = os.path.join(MODEL_DIR, "unique_colleges.csv")
        _COLLEGES_DF = pd.read_csv(data_path)
        _COLLEGES_DF = _COLLEGES_DF[['institute', 'academic_program_name']].dropna().drop_duplicates()
    return _COLLEGES_DF


class PredictCollegesView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_rank = request.data.get('jee_mains_rank')
        user_seat_type = request.data.get('seat_type', 'OPEN')
        user_gender = request.data.get('gender', 'Gender-Neutral')
        user_quota = request.data.get('quota', 'AI')
        result_count = int(request.data.get('result_count', 20))

        if not user_rank:
            return Response({'error': 'JEE Mains Rank is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rank = int(user_rank)

            # ── Load model, encoders, and college list (cached after first call) ──
            rf_model = _load_model()
            encoders = _load_encoders()
            colleges_df = _load_colleges()

            # ── Validate that user inputs exist in the encoder classes ──
            if user_quota not in encoders['quota'].classes_:
                return Response({
                    'message': f"Unknown quota '{user_quota}'. Valid values: {list(encoders['quota'].classes_)}",
                    'data': []
                }, status=status.HTTP_200_OK)

            if user_seat_type not in encoders['seat_type'].classes_:
                return Response({
                    'message': f"Unknown seat type '{user_seat_type}'. Valid values: {list(encoders['seat_type'].classes_)}",
                    'data': []
                }, status=status.HTTP_200_OK)

            if user_gender not in encoders['gender'].classes_:
                return Response({
                    'message': f"Unknown gender '{user_gender}'. Valid values: {list(encoders['gender'].classes_)}",
                    'data': []
                }, status=status.HTTP_200_OK)

            # ── Build feature DataFrame for all colleges with user's category ──
            batch = colleges_df.copy()
            batch['quota'] = user_quota
            batch['seat_type'] = user_seat_type
            batch['gender'] = user_gender
            batch['year'] = 2026

            features = ['institute', 'academic_program_name', 'quota', 'seat_type', 'gender', 'year']
            X = batch[features].copy()

            # Encode categorical features using the label encoders
            for col in ['institute', 'academic_program_name', 'quota', 'seat_type', 'gender']:
                X[col] = encoders[col].transform(X[col])

            # ── Run the Random Forest model prediction ──
            t0 = time.time()
            batch['predicted_cutoff'] = rf_model.predict(X).astype(int)
            inference_time = time.time() - t0
            logger.info(f"Model inference completed in {inference_time:.2f}s for {len(batch)} programs")

            # ── Filter results based on user's rank ──

            # Primary filter: programs where predicted cutoff >= user rank
            eligible = batch[batch['predicted_cutoff'] >= rank].sort_values(by='predicted_cutoff')

            if not eligible.empty:
                result_data = (
                    eligible[['predicted_cutoff', 'institute', 'academic_program_name']]
                    .head(result_count)
                    .to_dict('records')
                )
                return Response({
                    'message': f"Prediction successful (model inference: {inference_time:.2f}s). Showing top {len(result_data)} ambitious matches.",
                    'data': result_data
                }, status=status.HTTP_200_OK)

            # Fallback: no exact matches — show the closest programs
            max_cutoff = int(batch['predicted_cutoff'].max())
            min_cutoff = int(batch['predicted_cutoff'].min())

            fallback = (
                batch
                .sort_values(by='predicted_cutoff', ascending=False)
                .head(result_count)
            )
            result_data = (
                fallback[['predicted_cutoff', 'institute', 'academic_program_name']]
                .to_dict('records')
            )

            return Response({
                'message': (
                    f"No programs found with cutoff ≥ {rank} for {user_seat_type} / {user_quota}. "
                    f"The predicted cutoff range for this category is {min_cutoff} – {max_cutoff}. "
                    f"Showing the {len(result_data)} closest matches instead. "
                    f"(Model inference: {inference_time:.2f}s)"
                ),
                'data': result_data,
                'is_fallback': True,
                'max_cutoff': max_cutoff,
                'min_cutoff': min_cutoff
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            logger.error(f"Prediction error: {traceback.format_exc()}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework.permissions import IsAuthenticated

class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({'error': 'Both old_password and new_password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({'error': 'New password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user.check_password(old_password):
            return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        # Re-create token so the user stays logged in
        Token.objects.filter(user=user).delete()
        new_token = Token.objects.create(user=user)

        return Response({'message': 'Password changed successfully.', 'token': new_token.key}, status=status.HTTP_200_OK)
