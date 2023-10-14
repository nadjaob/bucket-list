from rest_framework import serializers
from ..models import Destination

class DestinationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Destination
    fields = '__all__'

class DestinationSerializerMinimalizedSlider(serializers.ModelSerializer):
  class Meta:
    model = Destination
    fields = ('id', 'name', 'destination_image')

class DestinationSerializerMinimalized(serializers.ModelSerializer):
  class Meta:
    model = Destination
    fields = ('id', 'name', 'destination_image', 'country', 'flag_image')

class DestinationSerializerMinimalizedWithCategories(serializers.ModelSerializer):
  class Meta:
    model = Destination
    fields = ('id', 'name', 'destination_image', 'country', 'flag_image', 'categories')