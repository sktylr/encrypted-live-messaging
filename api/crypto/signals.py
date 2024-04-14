from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import SymmetricKey


@receiver(post_save, sender=SymmetricKey)
def notify_users_of_new_symmetric_key(sender, instance: SymmetricKey, created: bool, **kwargs):
    if not created:
        return
    channel_layer = get_channel_layer()
    group_id = str(instance.group.id)
    message = {"type": "send.message", "message_type": "new_key", "message": ""}
    async_to_sync(channel_layer.group_send)(group_id, message)
