# Generated by Django 4.2.5 on 2023-10-04 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Destination',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField()),
                ('image', models.URLField()),
                ('country', models.CharField(max_length=50)),
                ('flag', models.URLField()),
                ('best_season', models.CharField(max_length=50)),
                ('travel_experience', models.CharField(max_length=50)),
            ],
        ),
    ]
