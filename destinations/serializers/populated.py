from .common import DestinationSerializer
from comments.serializers.common import CommentSerializer


class PopulatedDestinationSerializer(DestinationSerializer):
  comments = CommentSerializer(many=True)