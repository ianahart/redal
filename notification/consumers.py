import json
from channels.db import database_sync_to_async
from typing import Union, Dict, Any
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework import serializers
from comment.models import Comment
from comment.serializers import CommentCreateSerializer, CommentSerializer
from notification.models import Notification
from notification.serializers import NotificationSerializer
# pyright: reportOptionalMemberAccess=false

class Consumer(AsyncWebsocketConsumer):

    def notifications(self, author):
        objects = Notification.objects.fetch_notifications(0, author.id)
        serializer = NotificationSerializer(objects['notifications'], many=True)
        return {
            'notifications': serializer.data,
            'has_next': objects['has_next'],
            'page': objects['page']
        }

    def save_notification(self, data:Dict[str, Any]):
        Notification.objects.create(data)

    def save_comment(self, data):
        if data:
            create_serializer = CommentCreateSerializer(data=data)

            create_serializer.is_valid(raise_exception=True)
            create_serializer.validated_data

            object = Comment.objects.create(create_serializer.validated_data)
            comment_serializer = CommentSerializer(object)
            return comment_serializer.data, object

    async def connect(self):
        print('------------CONNECTED--------------')
        self.room_name = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        print('------------DISCONNECTED--------------')
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        comment, comment_obj = await database_sync_to_async(self.save_comment)(text_data_json['message'])

        notification = await database_sync_to_async(self.save_notification)(comment_obj)
        notifications = await database_sync_to_async(self.notifications)(comment_obj.author)

        print(message)
        self.sender_group_name = 'chat_' + str(self.room_name)
        self.reciever_group_name = 'chat_' + str(comment_obj.author.id)

        await self.channel_layer.group_send(
            self.sender_group_name,
            {
                'type': 'comment',
                'message': comment
            }
        )

        await self.channel_layer.group_send(
            self.reciever_group_name, {
                'type': 'notification',
                'message': notifications
            }
        )

    async def comment(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'comment': message
        }))


    async def notification(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'notification': message
        }))





