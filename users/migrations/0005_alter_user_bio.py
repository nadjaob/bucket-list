# Generated by Django 4.2.5 on 2023-10-04 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_user_profile_image_alter_user_bio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='bio',
            field=models.CharField(default='Welcome to my profile!', max_length=50),
            preserve_default=False,
        ),
    ]
