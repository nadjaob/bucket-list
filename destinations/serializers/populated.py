from .common import DestinationSerializer, DestinationSerializerMinimalizedWithCategories
from comments.serializers.populated import PopulatedCommentSerializer
from categories.serializers.common import CategorySerializer
from users.serializers.common import UserSerializer


class PopulatedDestinationSerializer(DestinationSerializer):
  comments = PopulatedCommentSerializer(many=True)
  categories = CategorySerializer(many=True)
  visited = UserSerializer(many=True)
  user = UserSerializer()
  invited = UserSerializer(many=True)

class SlightlyPopulatedDestinationSerializer(DestinationSerializerMinimalizedWithCategories):
  categories = CategorySerializer(many=True)