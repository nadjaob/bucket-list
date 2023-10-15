from .common import CommentSerializer
from users.serializers.common import UserProfileSerializer


class PopulatedCommentSerializer(CommentSerializer):
  user = UserProfileSerializer()