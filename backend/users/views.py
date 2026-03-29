from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer, CounsellingRequestSerializer

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
            return Response(data)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class CounsellingRequestCreateView(generics.CreateAPIView):
    serializer_class = CounsellingRequestSerializer
    permission_classes = [AllowAny]
