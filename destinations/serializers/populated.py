from .common import DestinationSerializer
from comments.serializers.common import CommentSerializer
from categories.serializers.common import CategorySerializer


class PopulatedDestinationSerializer(DestinationSerializer):
  comments = CommentSerializer(many=True)
  categories = CategorySerializer(many=True)