from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('college_admin', 'College Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    college = models.ForeignKey('colleges.College', on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    branch = models.CharField(max_length=100, null=True, blank=True)
    roll_number = models.CharField(max_length=50, null=True, blank=True)
    marksheet_first_year = models.FileField(upload_to='marksheets/', null=True, blank=True)
    def __str__(self):
        return f"{self.user.username} Profile"

class CollegeAdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='college_profile')
    college = models.ForeignKey('colleges.College', on_delete=models.CASCADE, related_name='admins')
    
    def __str__(self):
        return f"{self.user.username} - {self.college.name} Admin"

class CounsellingRequest(models.Model):
    ssc_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hsc_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    diploma_cgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    jee_mains_rank = models.IntegerField(null=True, blank=True)
    jee_mains_percentile = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    state = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Counselling Request from {self.state}"
