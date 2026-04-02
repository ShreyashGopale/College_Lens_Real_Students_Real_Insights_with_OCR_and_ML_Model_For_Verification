from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollegeViewSet, GalleryMediaViewSet, CutoffViewSet

router = DefaultRouter()
router.register(r'gallery', GalleryMediaViewSet, basename='gallery')
router.register(r'cutoffs', CutoffViewSet, basename='cutoffs')
router.register(r'', CollegeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
