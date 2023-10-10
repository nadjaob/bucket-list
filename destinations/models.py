from django.db import models

# Create your models here.
class Destination(models.Model):
  name = models.CharField(max_length=50)
  description = models.TextField(max_length=2000)
  destination_image = models.URLField()
  country = models.CharField(max_length=50)
  flag_image = models.URLField()
  best_season = models.CharField(max_length=50)
  travel_experience = models.CharField(max_length=50)
  categories = models.ManyToManyField(
    'categories.Category',
    related_name='destinations',
    blank=True
  )
  user = models.ForeignKey(
    'users.User',
    related_name='created',
    on_delete=models.SET_NULL,
    null=True,
    blank=True
  )
  bucketlist = models.ManyToManyField(
    'users.User',
    related_name='bucketlist',
    blank=True
  )
  visited = models.ManyToManyField(
    'users.User',
    related_name='visited',
    blank=True
  )

  def __str__(self):
    return f"{self.name} - {self.country}"