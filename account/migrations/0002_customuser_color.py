# Generated by Django 4.1.1 on 2022-09-20 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="color",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
