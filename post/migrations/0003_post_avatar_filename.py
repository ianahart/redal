# Generated by Django 4.1.1 on 2022-09-24 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("post", "0002_post_initials"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="avatar_filename",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]