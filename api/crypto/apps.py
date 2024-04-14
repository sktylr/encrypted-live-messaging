import importlib

from django.apps import AppConfig


class CryptoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "crypto"

    def ready(self):
        importlib.import_module(".signals", package=self.name)
