import logging
from typing import Any, Dict

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import AuthUser, TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

User = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        return super().validate(
            {
                self.username_field: attrs[self.username_field].lower(),
                "password": attrs["password"],
            }
        )

    @classmethod
    def get_token(cls, user: AuthUser) -> Token:
        token = super().get_token(user)
        token["username"] = user.username
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=(validate_password,))
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "password", "confirm_password"]

    def validate(self, attrs: dict) -> dict:
        if attrs["password"] != attrs["confirm_password"]:
            logger.error("[REGISTER]: User attempting to register with mismatched password!")
            raise serializers.ValidationError({"error_code": "Password fields don't match!"})
        return super().validate(attrs)

    def create(self, validated_data: dict):
        password = validated_data["password"]
        validated_data = {k: v for k, v in validated_data.items() if k not in ["confirm_password", "password"]}
        user = super().create({**validated_data, "username": validated_data["email"]})
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "id", "created_at", "updated_at")
