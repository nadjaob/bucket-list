# Generated by Django 4.2.5 on 2023-10-10 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0001_initial'),
        ('destinations', '0013_alter_destination_categories'),
    ]

    operations = [
        migrations.AlterField(
            model_name='destination',
            name='categories',
            field=models.ManyToManyField(blank=True, related_name='destinations', to='categories.category'),
        ),
    ]