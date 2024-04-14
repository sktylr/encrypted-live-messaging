from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import SymmetricKey


@receiver(post_save, sender=SymmetricKey)
def notify_users_of_new_symmetric_key(sender, instance: SymmetricKey, created: bool, **kwargs):
    """Triggered every time a SymmetricKey instance is updated or created in the database
    We want to send a message to the group along the websocket indicating that the key for the group has been updated
    """
    if not created:
        return
    channel_layer = get_channel_layer()
    group_id = str(instance.group.id)
    message = {"type": "send.message", "message_type": "new_key", "message": ""}
    # send this message to all clients listening to the group's websocket channel, even those who are not group members
    # this is required so that those who have been removed from the group are now aware they have been removed, even
    # though the server already possesses this knowledge
    async_to_sync(channel_layer.group_send)(group_id, message)
