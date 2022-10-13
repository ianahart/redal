from rest_framework import serializers

from setting.models import Setting


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ('id', 'user_id', 'notifications_on', 'messages_on', )


class SettingUpdateNotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ('notifications_on', )


class  SettingUpdateMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ('messages_on', )
