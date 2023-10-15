from .common import DestinationSerializer, DestinationSerializerMinimalizedWithCategories, DestinationSerializerMinimalizedLikes
from comments.serializers.populated import PopulatedCommentSerializer
from categories.serializers.common import CategorySerializer
from users.serializers.common import UserProfileSerializer, UserSerializerMinimalized


class PopulatedDestinationSerializer(DestinationSerializer):
  comments = PopulatedCommentSerializer(many=True)
  categories = CategorySerializer(many=True)
  visited = UserProfileSerializer(many=True)
  user = UserProfileSerializer()
  invited = UserProfileSerializer(many=True)

class SlightlyPopulatedDestinationSerializer(DestinationSerializerMinimalizedWithCategories):
  categories = CategorySerializer(many=True)

class PopulatedDestinationSerializerLikes(DestinationSerializerMinimalizedLikes):
  visited = UserSerializerMinimalized(many=True)
  bucketlist = UserSerializerMinimalized(many=True)