from rest_framework.generics import RetrieveUpdateDestroyAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Comment

from .serializers.common import CommentSerializer

from lib.views import UserListCreateAPIView
from lib.permissions import IsOwnerOrReadOnly


# Generic views
class CommentView(GenericAPIView):
  queryset = Comment.objects.all()
  serializer_class = CommentSerializer

# /comments
class CommentListView(CommentView, UserListCreateAPIView):
  permission_classes = [IsAuthenticatedOrReadOnly]

# /comments/:pk
class CommentDetailView(CommentView, RetrieveUpdateDestroyAPIView):
  permission_classes = [IsOwnerOrReadOnly]