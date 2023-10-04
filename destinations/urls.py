from .views import DestinationListView, DestinationDetailView
from django.urls import path

urlpatterns = [
  path('', DestinationListView.as_view()),
  path('<int:pk>/', DestinationDetailView.as_view())
]