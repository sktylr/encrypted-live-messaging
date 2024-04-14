from django.db import models
from django.utils.timezone import now

from api import settings
from api.models import BaseModel


class SymmetricKey(BaseModel):
    group = models.ForeignKey("custom_messages.MessageGroup", on_delete=models.CASCADE, to_field="id")
    key = models.CharField(null=False, blank=False, max_length=255, unique_for_year=True)

    class Meta:
        app_label = "crypto"
        ordering = ("-pkid",)


class AsymmetricPublicKey(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, to_field="id")
    x509_pem = models.TextField(null=False, blank=False)
    public_key = models.TextField(null=False, blank=False)
    not_before = models.DateField(null=False, blank=False, default=now)
    not_after = models.DateField(null=False, blank=False, default=now)

    class Meta:
        app_label = "crypto"
        ordering = ("-pkid",)
