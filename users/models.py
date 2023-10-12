from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
  bio = models.CharField(max_length=50)
  profile_image = models.URLField(blank=True, default='https://res.cloudinary.com/djhbqxz1j/image/upload/v1697096215/bucket-list/default-profile-image_wgsxr7.png')