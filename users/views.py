from rest_framework.generics import CreateAPIView, GenericAPIView
from django.views.generic import DetailView
from .serializers.common import RegistrationSerializer, UserSerializer
from .serializers.populated import PopulatedUserSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class RegisterView(CreateAPIView):
  queryset = User.objects.all()
  serializer_class = RegistrationSerializer

class UserDetailView(APIView):
    def get(self, request, username):    
      try:
        user = User.objects.get(username=username)
        serialized_user = PopulatedUserSerializer(user)
        return Response(serialized_user.data)
      except User.DoesNotExist as e:
        return Response({ 'error': str(e) }, status.HTTP_404_NOT_FOUND)
      except Exception as e:
        return Response({ 'error': str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(APIView):
  permission_classes = [IsAuthenticated]
  serializer_class = UserSerializer

  def get(self, request):    
      try:
        user = User.objects.get(pk=self.request.user.pk)
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data)
      except User.DoesNotExist as e:
        return Response({ 'error': str(e) }, status.HTTP_404_NOT_FOUND)
      except Exception as e:
        return Response({ 'error': str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)