# Generated by Django 5.0.3 on 2024-04-03 08:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("custom_messages", "0006_remove_usergroup_user"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="usergroup",
            name="user",
            field=models.ForeignKey(
                default="240b0760-926f-4374-8167-4acf8cfb2f82",
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
                to_field="id",
            ),
            preserve_default=False,
        ),
    ]
