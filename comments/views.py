# Rest framework
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView

# Model
from .models import Comment

# Serializer
from .serializers.common import CommentSerializer


# Generic views
class CommentView(GenericAPIView):
  queryset = Comment.objects.all()
  serializer_class = CommentSerializer

class CommentListView(CommentView, ListCreateAPIView):
  pass

class CommentDetailView(CommentView, RetrieveUpdateDestroyAPIView):
  pass