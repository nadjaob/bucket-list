# Generated by Django 4.2.5 on 2023-10-04 17:34

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('destinations', '0005_alter_destination_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='destination',
            name='bucketlist',
            field=models.ManyToManyField(blank=True, related_name='bucketlist', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='destination',
            name='visited',
            field=models.ManyToManyField(blank=True, related_name='visited', to=settings.AUTH_USER_MODEL),
        ),
    ]
