# Generated by Django 4.1.1 on 2022-10-09 22:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("community", "0004_alter_community_name"),
        ("private", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="private",
            name="community",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="private_community",
                to="community.community",
            ),
        ),
    ]
