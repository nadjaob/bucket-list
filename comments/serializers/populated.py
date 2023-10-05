from .common import CommentSerializer
from users.serializers.common import UserSerializer


class PopulatedCommentSerializer(CommentSerializer):
  user = UserSerializer()