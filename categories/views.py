from rest_framework.generics import ListCreateAPIView
from .models import Category
from .serializers.common import CategorySerializer
from .serializers.populated import PopulatedCategorySerializer


class CategoryListView(ListCreateAPIView):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer