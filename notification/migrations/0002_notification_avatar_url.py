# Generated by Django 4.1.1 on 2022-10-06 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notification", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="notification",
            name="avatar_url",
            field=models.URLField(blank=True, null=True),
        ),
    ]
