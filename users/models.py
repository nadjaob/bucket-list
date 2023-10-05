from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
  bio = models.CharField(max_length=50)
  profile_image = models.URLField(blank=True, default='https://www.senertec.de/wp-content/uploads/2020/04/blank-profile-picture-973460_1280.png')
  background_image = models.URLField(blank=True, default='https://switzerland-tour.com/storage/media/4-ForArticles/swiss-mountains.jpg')