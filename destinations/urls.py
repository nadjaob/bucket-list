from .views import (
  DestinationListView,
  DestinationDetailView,
  DestinationBucketlistView,
  DestinationVisitedView,
  DestinationInvitationsView,
  InvitationDeleteView
)
from django.urls import path

urlpatterns = [
  path('', DestinationListView.as_view()),
  path('<int:pk>/', DestinationDetailView.as_view()),
  path('<int:pk>/bucketlist/', DestinationBucketlistView.as_view()),
  path('<int:pk>/visited/', DestinationVisitedView.as_view()),
  path('<int:pk>/invitations/', DestinationInvitationsView.as_view()),
  path('<int:pk>/invitations/delete/', InvitationDeleteView.as_view())
]