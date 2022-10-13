import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.serializers import MessageSerializer, MessageUserSerializer

from chat.models import Message
# pyright: reportOptionalMemberAccess=false
class ChatConsumer(AsyncWebsocketConsumer):

    def send_message(self, data):
        message_serializer = MessageUserSerializer(data=data)
        message_serializer.is_valid() 
        instance = Message.objects.create(message_serializer.validated_data)
        serializer = MessageSerializer(instance)
        return serializer.data


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_text = text_data_json['message']
        message = await database_sync_to_async(self.send_message)(message_text)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
