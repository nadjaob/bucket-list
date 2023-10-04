from rest_framework.generics import (
  ListCreateAPIView,
  RetrieveUpdateDestroyAPIView,
  UpdateAPIView,
  GenericAPIView
)
from lib.views import UserListCreateAPIView
from lib.permissions import IsOwnerOrReadOnly

# Permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

# Model
from .models import Destination

# Serializer
from .serializers.common import DestinationSerializer
from .serializers.populated import PopulatedDestinationSerializer


# Generic view
class DestinationView(GenericAPIView):
  queryset=Destination.objects.all()
  serializer_class=PopulatedDestinationSerializer

# /destinations
class DestinationListView(DestinationView, UserListCreateAPIView):
  permission_classes=[IsAuthenticatedOrReadOnly]

# /destinations/:id
class DestinationDetailView(DestinationView, RetrieveUpdateDestroyAPIView):
  permission_classes=[IsOwnerOrReadOnly]

# /destinations/:id/bucketlist
class DestinationBucketlistView(DestinationView, UpdateAPIView):
  pass

# /destinations/:id/visited
class DestinationVisitedView(DestinationView, UpdateAPIView):
  pass