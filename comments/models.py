from django.db import models

# Create your models here.
class Comment(models.Model):
  title = models.CharField(max_length=50)
  content = models.TextField(max_length=300)
  destination = models.ForeignKey(
    'destinations.Destination',
    related_name='comments',
    on_delete=models.CASCADE
  )
  user = models.ForeignKey(
    'users.User',
    related_name='comments',
    on_delete=models.CASCADE,
    default=1,
  )

  def __str__(self):
    return f"{self.destination} - {self.user}"