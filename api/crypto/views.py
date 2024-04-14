from rest_framework import mixins, settings, status, viewsets
from rest_framework.response import Response

from api.permissions import IsAuthenticated

from .models import AsymmetricPublicKey, SymmetricKey
from .serializers import AsymmetricPublicKeySerializer
from .services.key_management_service import get_key_for_group_and_user
from .services.rsa import generate_x509_cert_pem


class RSAViewSet(viewsets.ReadOnlyModelViewSet, mixins.CreateModelMixin):
    queryset = AsymmetricPublicKey.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = settings.api_settings.DEFAULT_FILTER_BACKENDS
    serializer_class = AsymmetricPublicKeySerializer

    def list(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            response.data = {"x509_pem": generate_x509_cert_pem()}
        return response


class SymmetricKeyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SymmetricKey.objects.all()
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def list(self, request, *args, **kwargs):
        group = request.GET.get("group")
        user = request.user
        encrypted_key, signature, key_id = get_key_for_group_and_user(user, group)
        return Response(status=status.HTTP_200_OK, data={"key": encrypted_key, "id": key_id, "signature": signature})
