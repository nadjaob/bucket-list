from .common import UserSerializer
from destinations.serializers.common import DestinationSerializer, DestinationSerializerMinimalized


class PopulatedUserSerializer(UserSerializer):
  bucketlist = DestinationSerializer(many=True)
  visited = DestinationSerializer(many=True)
  created = DestinationSerializer(many=True)
  invitations = DestinationSerializer(many=True)


class PopulatedUserSerializerMinimalized(UserSerializer):
  bucketlist = DestinationSerializerMinimalized(many=True)
  visited = DestinationSerializerMinimalized(many=True)
  created = DestinationSerializerMinimalized(many=True)
  invitations = DestinationSerializerMinimalized(many=True)