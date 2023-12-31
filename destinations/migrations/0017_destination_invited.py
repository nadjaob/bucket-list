# Generated by Django 4.2.5 on 2023-10-12 09:42

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('destinations', '0016_alter_destination_bucketlist_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='destination',
            name='invited',
            field=models.ManyToManyField(blank=True, related_name='invitations', to=settings.AUTH_USER_MODEL),
        ),
    ]
