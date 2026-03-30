from django.urls import path
from .views import RegisterView, LoginView, CounsellingRequestCreateView, StudentCollegeRegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('counselling/', CounsellingRequestCreateView.as_view(), name='counselling-request'),
    path('student-register/', StudentCollegeRegisterView.as_view(), name='student-register'),
]
