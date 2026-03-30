from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Review, Comment
from .serializers import ReviewSerializer, CommentSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    def get_queryset(self):
        queryset = super().get_queryset()
        college_id = self.request.query_params.get('college')
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        return queryset

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        review_id = self.kwargs.get('review_pk')
        try:
            review = Review.objects.get(pk=review_id)
        except Review.DoesNotExist:
            raise ValidationError({"detail": "Review not found."})
            
        serializer.save(user=self.request.user, review=review)

    def get_queryset(self):
         # Filter by review if provided in nested route (if we decide to use nested routes later)
         # For now simple filtering
         queryset = super().get_queryset()
         return queryset
