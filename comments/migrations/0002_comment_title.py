# Generated by Django 4.2.5 on 2023-10-04 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='title',
            field=models.CharField(default='Amazing place', max_length=50),
            preserve_default=False,
        ),
    ]
