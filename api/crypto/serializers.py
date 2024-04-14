from rest_framework import serializers

from .models import AsymmetricPublicKey
from .services.key_management_service import verify_and_create_public_key


class AsymmetricPublicKeySerializer(serializers.ModelSerializer):

    class Meta:
        model = AsymmetricPublicKey
        fields = (
            "x509_pem",
            "public_key",
            "not_before",
            "not_after",
        )
        read_only_fields = ("not_before", "not_after")

    def create(self, validated_data):
        request = self.context["request"]
        return verify_and_create_public_key(**validated_data, user=request.user)
