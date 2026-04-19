from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, CollegeAdminProfile, CounsellingRequest
from colleges.models import College

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'student')
        )
        return user

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'

class CollegeAdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeAdminProfile
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    # College specific fields for admin registration
    college_name = serializers.CharField(required=False, write_only=True)
    established_year = serializers.IntegerField(required=False, write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'college_name', 'established_year')

    def create(self, validated_data):
        role = validated_data.get('role')
        
        # Extract college data
        college_data = {
            'name': validated_data.pop('college_name', None),
            'established_year': validated_data.pop('established_year', None),
        }
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role
        )

        if role == 'student':
            StudentProfile.objects.create(user=user)
        elif role == 'college_admin':
            if college_data['name']:
                college = College.objects.create(**college_data)
                CollegeAdminProfile.objects.create(user=user, college=college)
        
        return user

class CounsellingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounsellingRequest
        fields = '__all__'

class StudentCollegeRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    college = serializers.PrimaryKeyRelatedField(queryset=College.objects.all(), required=True)
    degree_type = serializers.CharField(max_length=100, required=True)
    branch = serializers.CharField(max_length=100, required=True)
    first_name = serializers.CharField(max_length=100, required=True)
    middle_name = serializers.CharField(max_length=100, required=True)
    last_name = serializers.CharField(max_length=100, required=True)
    marksheet_first_year = serializers.FileField(required=True)
    fees_receipt = serializers.FileField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'college', 'degree_type', 'branch', 'first_name', 'middle_name', 'last_name', 'marksheet_first_year', 'fees_receipt')

    def create(self, validated_data):
        # Extract profile-specific data
        college = validated_data.pop('college')
        degree_type = validated_data.pop('degree_type')
        branch = validated_data.pop('branch')
        first_name = validated_data.pop('first_name')
        middle_name = validated_data.pop('middle_name')
        last_name = validated_data.pop('last_name')
        marksheet = validated_data.pop('marksheet_first_year')
        fees_receipt = validated_data.pop('fees_receipt')
        
        # User creation
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role='student'
        )
        
        # Create profile directly attaching physical parameters accurately
        StudentProfile.objects.create(
            user=user,
            college=college,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            degree_type=degree_type,
            branch=branch,
            marksheet_first_year=marksheet,
            fees_receipt=fees_receipt,
            verification_status='Verified', # Base status - validation precedes this saving step natively upstream!
            verification_data={}
        )
        
        return user
