from .common import UserSerializer
from destinations.serializers.common import DestinationSerializer


class PopulatedUserSerializer(UserSerializer):
  bucketlist = DestinationSerializer(many=True)
  visited = DestinationSerializer(many=True)
  created = DestinationSerializer(many=True)
  invitations = DestinationSerializer(many=True)