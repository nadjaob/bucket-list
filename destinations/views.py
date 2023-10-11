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
  serializer_class=DestinationSerializer

# /destinations
class DestinationListView(DestinationView, UserListCreateAPIView):
  permission_classes=[IsAuthenticatedOrReadOnly]
  
  def get_serializer_class(self):
     if self.request.method == 'GET':
        return PopulatedDestinationSerializer
     return DestinationSerializer
  

# /destinations/:id
class DestinationDetailView(DestinationView, RetrieveUpdateDestroyAPIView):
  permission_classes=[IsOwnerOrReadOnly]

  def get_serializer_class(self):
     if self.request.method == 'PATCH':
        return DestinationSerializer
     return PopulatedDestinationSerializer

# /destinations/:id/bucketlist
class DestinationBucketlistView(DestinationView, UpdateAPIView):
  permission_classes = [IsAuthenticated]
  serializer_class=PopulatedDestinationSerializer
 
  def patch(self, request, *args, **kwargs):
    destination = self.get_object()
   
    if request.user in destination.bucketlist.all():
      destination.bucketlist.remove(request.user)
      destination.save()
      return Response(status=204)
    else:
      destination.bucketlist.add(request.user)
      destination.save()
      return Response(status=201)

# /destinations/:id/visited
class DestinationVisitedView(DestinationView, UpdateAPIView):
  permission_classes = [IsAuthenticated]
 
  def patch(self, request, *args, **kwargs):
    destination = self.get_object()
   
    if request.user in destination.visited.all():
      destination.visited.remove(request.user)
      destination.save()
      return Response(status=204)
    else:
      destination.visited.add(request.user)
      destination.save()
      return Response(status=201)