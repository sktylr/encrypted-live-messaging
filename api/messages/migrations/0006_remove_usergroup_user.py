# Generated by Django 5.0.3 on 2024-04-03 08:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("custom_messages", "0005_message_initialisation_vector"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="usergroup",
            name="user",
        ),
    ]
