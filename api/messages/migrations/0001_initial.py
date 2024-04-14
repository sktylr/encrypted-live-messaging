# Generated by Django 5.0.3 on 2024-04-01 10:47

import uuid

import django.db.models.deletion
import django.utils.timezone
import model_utils.fields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="MessageGroup",
            fields=[
                ("pkid", models.BigAutoField(primary_key=True, serialize=False)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("created_at", model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                (
                    "updated_at",
                    model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False),
                ),
                ("group_name", models.CharField(max_length=255)),
            ],
            options={
                "ordering": ("-pkid",),
            },
        ),
        migrations.CreateModel(
            name="Message",
            fields=[
                ("pkid", models.BigAutoField(primary_key=True, serialize=False)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("created_at", model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                (
                    "updated_at",
                    model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False),
                ),
                ("cipher_text", models.TextField()),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="messages",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="custom_messages.messagegroup", to_field="id"
                    ),
                ),
            ],
            options={
                "ordering": ("-pkid",),
            },
        ),
        migrations.CreateModel(
            name="UserGroup",
            fields=[
                ("pkid", models.BigAutoField(primary_key=True, serialize=False)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("created_at", model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                (
                    "updated_at",
                    model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="custom_messages.messagegroup", to_field="id"
                    ),
                ),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("-pkid",),
            },
        ),
    ]