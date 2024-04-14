import importlib

from django.apps import AppConfig


class MessagesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "messages"
    label = "custom_messages"
    verbose_name = "Custom Messages"

    def ready(self):
        importlib.import_module(".signals", package=self.name)
