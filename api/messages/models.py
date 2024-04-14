from django.db import models

from api import settings
from api.models import BaseModel


class MessageGroup(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, to_field="id")
    group_name = models.CharField(max_length=255)

    class Meta:
        ordering = ("-pkid",)
        app_label = "custom_messages"


class Message(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="messages", to_field="id")
    cipher_text = models.TextField(null=False, blank=False)
    group = models.ForeignKey(MessageGroup, on_delete=models.CASCADE, to_field="id")
    initialisation_vector = models.CharField(null=False, max_length=32)
    key = models.ForeignKey("crypto.SymmetricKey", on_delete=models.CASCADE, to_field="id", null=True)

    class Meta:
        ordering = ("-pkid",)
        app_label = "custom_messages"


class UserGroup(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, to_field="id")
    group = models.ForeignKey(MessageGroup, on_delete=models.CASCADE, to_field="id")

    class Meta:
        ordering = ("-pkid",)
        app_label = "custom_messages"
