from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from crypto.services import key_management_service

from .models import Message, MessageGroup, UserGroup
from .serializers import MessageSerializer


@receiver(post_save, sender=Message)
def send_websockets_messages(sender, instance: Message, created: bool, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        group_id = str(instance.group.id)
        message = MessageSerializer(instance=instance).data
        message["group"] = group_id
        message = {"type": "send.message", "message_type": "new_message", "message": message}
        async_to_sync(channel_layer.group_send)(group_id, message)


@receiver(post_save, sender=MessageGroup)
def generate_group_key(sender, instance: MessageGroup, created: bool, **kwargs):
    if not created:
        return
    key_management_service.generate_key_for_group(instance)


@receiver(post_delete, sender=UserGroup)
def generate_new_group_key(sender, instance: UserGroup, **kwargs):
    key_management_service.generate_key_for_group(instance.group)


@receiver(post_save, sender=UserGroup)
def notify_user_of_joining(sender, instance: UserGroup, created: bool, **kwargs):
    if not created:
        return
    channel_layer = get_channel_layer()
    group_id = str(instance.group.id)
    message = {"type": "send.message", "message_type": "new_user", "message": f"{instance.user.id}"}
    async_to_sync(channel_layer.group_send)(group_id, message)
