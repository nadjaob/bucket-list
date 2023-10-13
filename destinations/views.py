from rest_framework.generics import (
  ListCreateAPIView,
  RetrieveUpdateDestroyAPIView,
  DestroyAPIView,
  UpdateAPIView,
  GenericAPIView
)
from lib.views import UserListCreateAPIView
from lib.permissions import IsOwnerOrReadOnly

# Permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# Model
from .models import Destination

# Serializer
from .serializers.common import DestinationSerializer
from .serializers.populated import PopulatedDestinationSerializer, SlightlyPopulatedDestinationSerializer

from rest_framework.pagination import PageNumberPagination

from django.contrib.auth import get_user_model
User = get_user_model()


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 4

# Generic view
class DestinationView(GenericAPIView):
  queryset=Destination.objects.all()
  serializer_class=DestinationSerializer

# /destinations
class DestinationListView(DestinationView, UserListCreateAPIView):
  permission_classes=[IsAuthenticatedOrReadOnly]
  
  def get_serializer_class(self):
     use_populated_serializer = self.request.query_params.get('use_populated_serializer')
     if self.request.method == 'GET' and use_populated_serializer == 'true':
        return PopulatedDestinationSerializer
     return DestinationSerializer
  
# /destinations/slider
class DestinationSliderListView(DestinationView, UserListCreateAPIView):
  pagination_class = StandardResultsSetPagination

# /destinations/search
class DestinationSearchListView(DestinationView, UserListCreateAPIView):
  serializer_class = SlightlyPopulatedDestinationSerializer

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
      destination.invited.remove(request.user)
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
      destination.invited.remove(request.user)
      destination.save()
      return Response(status=201)
    

# /destinations/:id/invitations
class DestinationInvitationsView(DestinationView, UpdateAPIView):
  permission_classes = [IsAuthenticated]
 
  def patch(self, request, *args, **kwargs):
    destination = self.get_object()
    # user_id_of_inviter = request.data.get('user_id_of_inviter')
    user_id_to_invite = request.data.get('user_id_to_invite')

    # if not user_id_of_inviter:
    #   return Response({ 'error: User ID of inviter not found' }, status.HTTP_404_NOT_FOUND)
    
    if not user_id_to_invite:
      return Response({ 'error: User ID of user to invite not found' }, status.HTTP_404_NOT_FOUND)
    
    if request.user.id is user_id_to_invite:
      return Response({"error": "Cant invite yourself"}, status.HTTP_400_BAD_REQUEST)
    
    try:
      user_to_invite = User.objects.get(id=user_id_to_invite)
    except User.DoesNotExist:
      return Response({"error": "User not found"}, status.HTTP_400_BAD_REQUEST)
    
    if user_to_invite in destination.invited.all():
      return Response({'error': 'User is already invited'}, status.HTTP_409_CONFLICT)
    else:
      destination.invited.add(user_to_invite)
      destination.save()
      return Response(status=201)
    


class InvitationDeleteView(Destination, DestroyAPIView):
  permission_classes = [IsAuthenticated]
  queryset = Destination.objects.all()
  
  def delete(self, request, *args, **kwargs):
    destination = self.get_object()
    invitation_id = request.data.get('invitation_id')

    try:
      invitation = destination.invited.get(id=invitation_id)
      destination.invited.remove(invitation)
      destination.save()
      return Response(status=204)
    except Destination.DoesNotExist:
      return Response({ 'error: Invitation not found in the destination' }, status.HTTP_404_NOT_FOUND)
