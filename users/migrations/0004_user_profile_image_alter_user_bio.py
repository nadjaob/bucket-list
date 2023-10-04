# Generated by Django 4.2.5 on 2023-10-04 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_image',
            field=models.URLField(blank=True, default='https://www.senertec.de/wp-content/uploads/2020/04/blank-profile-picture-973460_1280.png'),
        ),
        migrations.AlterField(
            model_name='user',
            name='bio',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
