from rest_framework.generics import CreateAPIView, ListCreateAPIView
from .serializers.common import RegistrationSerializer, UserProfileSerializer, UserSerializerMinimalized
from .serializers.populated import PopulatedUserSerializerMinimalized
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# class RegisterView(CreateAPIView):
#   queryset = User.objects.all()
#   serializer_class = RegistrationSerializer
  
#   def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         # Create the user
#         user = serializer.save()

#         # Get tokens for the newly registered user
#         tokens = get_tokens_for_user(user)

#         return Response(tokens, status=status.HTTP_201_CREATED)
  
class RegisterView(APIView):
  def post(self, request):
    try:
      user_to_register = RegistrationSerializer(data=request.data)

      if user_to_register.is_valid():
        user = user_to_register.save()

        tokens = get_tokens_for_user(user)
        return Response(tokens, status.HTTP_201_CREATED)

      return Response(user_to_register.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
    except Exception as e:
      return Response({'detail': str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserDetailView(APIView):
    def get(self, request, username):    
      try:
        user = User.objects.get(username=username)
        serialized_user = PopulatedUserSerializerMinimalized(user)
        return Response(serialized_user.data)
      except User.DoesNotExist as e:
        return Response({ 'error': str(e) }, status.HTTP_404_NOT_FOUND)
      except Exception as e:
        return Response({ 'error': str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(APIView):
  permission_classes = [IsAuthenticated]
  serializer_class = UserProfileSerializer

  def get(self, request):    
      try:
        user = User.objects.get(pk=self.request.user.pk)
        serialized_user = UserProfileSerializer(user)
        return Response(serialized_user.data)
      except User.DoesNotExist as e:
        return Response({ 'error': str(e) }, status.HTTP_404_NOT_FOUND)
      except Exception as e:
        return Response({ 'error': str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)
      

class UserListView(ListCreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializerMinimalized