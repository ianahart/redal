# Generated by Django 4.1.1 on 2022-09-23 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("community", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="community",
            name="slug",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]