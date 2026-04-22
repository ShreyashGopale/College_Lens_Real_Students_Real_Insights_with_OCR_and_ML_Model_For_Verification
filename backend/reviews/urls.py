from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, CommentViewSet, college_sentiment

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
    path('colleges/<int:college_id>/sentiment/', college_sentiment, name='college-sentiment'),
]
