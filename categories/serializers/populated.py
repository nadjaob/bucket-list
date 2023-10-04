from .common import CategorySerializer
from destinations.serializers.common import DestinationSerializer


class PopulatedCategorySerializer(CategorySerializer):
  destinations = DestinationSerializer(many=True)