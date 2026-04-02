from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import College, GalleryMedia, Cutoff
from .serializers import CollegeSerializer, GalleryMediaSerializer, CutoffSerializer


class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location']

    def perform_create(self, serializer):
        college = serializer.save()
        user = self.request.user
        if user.is_authenticated and user.role == 'college_admin':
            # Create the profile linking user to this college
            from users.models import CollegeAdminProfile
            CollegeAdminProfile.objects.create(user=user, college=college)

    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        # Placeholder for top rated logic - currently returning first 5
        # In future, this will aggregate reviews
        colleges = College.objects.all()[:5]
        serializer = self.get_serializer(colleges, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        location = request.query_params.get('location')
        if location:
            colleges = College.objects.filter(location__icontains=location)
            serializer = self.get_serializer(colleges, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        # Placeholder if we add college type (Engineering, Medical, etc.)
        return Response([])


class GalleryMediaViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryMediaSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = GalleryMedia.objects.all().order_by('-uploaded_at')
        college_id = self.request.query_params.get('college')
        category = self.request.query_params.get('category')
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    def perform_create(self, serializer):
        # Auto-detect media type from file extension
        file = self.request.FILES.get('file')
        media_type = 'photo'
        if file:
            name = file.name.lower()
            if name.endswith(('.mp4', '.mov', '.avi', '.webm', '.mkv')):
                media_type = 'video'
        serializer.save(media_type=media_type)

class CutoffViewSet(viewsets.ModelViewSet):
    serializer_class = CutoffSerializer
    
    def get_queryset(self):
        queryset = Cutoff.objects.all()
        college_id = self.request.query_params.get('college')
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        return queryset
