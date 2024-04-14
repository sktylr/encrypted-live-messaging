from uuid import UUID

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer


class MessageConsumer(JsonWebsocketConsumer):
    """A simple consumer class the allows for the receipt and sending of messages along a websocket channel"""

    message_group: str | UUID

    def connect(self):
        """Triggered by the client library when a new websocket connection is initiated"""
        # `message_group` is the id of the message group, meaning that messages are only sent to clients watching a
        # specific group
        self.message_group = self.scope["url_route"]["kwargs"]["message_group"]

        async_to_sync(self.channel_layer.group_add)(self.message_group, self.channel_name)

        self.accept()

    def disconnect(self, code):
        """Triggered on disconnection and removes the client from the group to clean up resources"""
        async_to_sync(self.channel_layer.group_discard)(
            self.message_group,
            self.channel_name,
        )

    def send_message(self, event):
        """Triggered by the server to send messages to the client"""
        message = event["message"]
        message_type = event["message_type"]
        self.send_json({"type": message_type, "message": message})
