from uuid import UUID

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer


class MessageConsumer(JsonWebsocketConsumer):
    message_group: str | UUID

    def connect(self):
        self.message_group = self.scope["url_route"]["kwargs"]["message_group"]

        async_to_sync(self.channel_layer.group_add)(self.message_group, self.channel_name)

        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.message_group,
            self.channel_name,
        )

    def send_message(self, event):
        message = event["message"]
        message_type = event["message_type"]
        self.send_json({"type": message_type, "message": message})
