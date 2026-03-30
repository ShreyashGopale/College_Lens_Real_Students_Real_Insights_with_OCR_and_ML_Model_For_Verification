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
    location = serializers.CharField(required=False, write_only=True)
    description = serializers.CharField(required=False, write_only=True)
    website = serializers.URLField(required=False, write_only=True)
    established_year = serializers.IntegerField(required=False, write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'college_name', 'location', 'description', 'website', 'established_year')

    def create(self, validated_data):
        role = validated_data.get('role')
        
        # Extract college data
        college_data = {
            'name': validated_data.pop('college_name', None),
            'location': validated_data.pop('location', None),
            'description': validated_data.pop('description', None),
            'website': validated_data.pop('website', None),
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
    branch = serializers.CharField(max_length=100, required=True)
    roll_number = serializers.CharField(max_length=50, required=True)
    marksheet_first_year = serializers.FileField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'college', 'branch', 'roll_number', 'marksheet_first_year')

    def create(self, validated_data):
        # Extract profile-specific data
        college = validated_data.pop('college')
        branch = validated_data.pop('branch')
        roll_number = validated_data.pop('roll_number')
        marksheet = validated_data.pop('marksheet_first_year')
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role='student'
        )
        
        # Create student profile
        StudentProfile.objects.create(
            user=user,
            college=college,
            branch=branch,
            roll_number=roll_number,
            marksheet_first_year=marksheet
        )
        
        return user
