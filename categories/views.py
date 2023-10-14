from rest_framework.generics import ListCreateAPIView
from .models import Category
from .serializers.common import CategorySerializer


class CategoryListView(ListCreateAPIView):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer