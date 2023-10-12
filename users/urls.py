from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import RegisterView, UserDetailView, UserProfileView, UserListView

urlpatterns = [
  path('login/', TokenObtainPairView.as_view()), 
  path('register/', RegisterView.as_view()),
  path('refresh/', TokenRefreshView.as_view()),
  path('userprofile/', UserProfileView.as_view()),
  path('users/', UserListView.as_view()),
  path('<str:username>/', UserDetailView.as_view()),
]