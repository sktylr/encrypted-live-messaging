from rest_framework import serializers

from accounts.serializers import UserSerializer
from crypto.models import SymmetricKey

from .models import Message, MessageGroup, UserGroup


class NestedUserGroupSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserGroup
        fields = ["user"]


class CreateUserGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserGroup
        exclude = ("pkid",)
        read_only_fields = ("group", "created_at", "updated_at", "id")

    def create(self, validated_data):
        request = self.context["request"]
        group_id = request.parser_context["kwargs"]["parent_lookup_group_id"]
        group = MessageGroup.objects.get(id=group_id)
        return super().create({**validated_data, "group": group})


class MessageGroupSerializer(serializers.ModelSerializer):
    users = NestedUserGroupSerializer(many=True, required=False, source="usergroup_set")
    created_by = UserSerializer(source="user", required=False)

    class Meta:
        model = MessageGroup
        fields = ("id", "created_at", "updated_at", "group_name", "users", "created_by")
        read_only_fields = ["id", "created_at", "updated_at", "users", "created_by"]

    def create(self, validated_data):
        user = self.context["request"].user
        message_group = super().create({**validated_data, "user": user})
        UserGroup.objects.create(group=message_group, user=user)
        return message_group


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    key = serializers.UUIDField(required=False, source="key_id")

    class Meta:
        model = Message
        exclude = ("pkid",)
        read_only_fields = ["id", "created_at", "updated_at", "group", "user"]

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        group_id = request.parser_context["kwargs"]["parent_lookup_group_id"]
        group = MessageGroup.objects.get(id=group_id)
        key = SymmetricKey.objects.filter(id=validated_data.get("key")).first()
        instance = super().create({**validated_data, "user": user, "group": group, "key": key})
        return instance
