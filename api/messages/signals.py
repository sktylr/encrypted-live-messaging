from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from crypto.services import key_management_service

from .models import Message, MessageGroup, UserGroup
from .serializers import MessageSerializer


@receiver(post_save, sender=Message)
def send_websockets_messages(sender, instance: Message, created: bool, **kwargs):
    """Send a websocket message to the group is a message has been created for the group"""
    if created:
        channel_layer = get_channel_layer()
        group_id = str(instance.group.id)
        # convert the message record in the database into a serialisable JSON format
        message = MessageSerializer(instance=instance).data
        message["group"] = group_id
        message = {"type": "send.message", "message_type": "new_message", "message": message}
        async_to_sync(channel_layer.group_send)(group_id, message)


@receiver(post_save, sender=MessageGroup)
def generate_group_key(sender, instance: MessageGroup, created: bool, **kwargs):
    """Triggered by an instance of MessageGroup being updated or created"""
    if not created:
        return
    # if the record has been created, we want to generate a new AES key for the group
    key_management_service.generate_key_for_group(instance)


@receiver(post_delete, sender=UserGroup)
def generate_new_group_key(sender, instance: UserGroup, **kwargs):
    """
    Triggered when a user is removed from a message group, we want to generate a new AES key for the group to ensure
    the old group member cannot decrypt future messages
    """
    key_management_service.generate_key_for_group(instance.group)


@receiver(post_save, sender=UserGroup)
def notify_user_of_joining(sender, instance: UserGroup, created: bool, **kwargs):
    """Triggered when a user is added to a group"""
    if not created:
        return
    # send this message to the whole channel to notify everyone listening that a new group member has joined.
    # in the case where the new user receives the notification, they will attempt to retrieve the latest AES key from
    # the server
    channel_layer = get_channel_layer()
    group_id = str(instance.group.id)
    message = {"type": "send.message", "message_type": "new_user", "message": f"{instance.user.id}"}
    async_to_sync(channel_layer.group_send)(group_id, message)
