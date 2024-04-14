from django.contrib.auth import get_user_model
from rest_framework import generics, settings, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from api.permissions import IsAuthenticated

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


class LoginViewSet(TokenObtainPairView):
    serializer_class = LoginSerializer


class RegisterViewSet(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = get_user_model().objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    filter_backends = settings.api_settings.DEFAULT_FILTER_BACKENDS
    lookup_field = "id"
    search_fields = ["first_name", "last_name", "username"]
    ordering = ("-pkid",)
