from rest_framework import mixins, settings, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.permissions import IsAuthenticated

from .models import Message, MessageGroup, UserGroup
from .serializers import CreateUserGroupSerializer, MessageGroupSerializer, MessageSerializer


class MessageGroupViewSet(viewsets.ModelViewSet):
    queryset = MessageGroup.objects.all()
    serializer_class = MessageGroupSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = settings.api_settings.DEFAULT_FILTER_BACKENDS
    lookup_field = "id"
    search_fields = ["group_name", "usergroup__user__first_name"]
    filterset_fields = {
        "usergroup__user__id": ["exact"],
    }
    ordering = ("-pkid",)


class MessageViewSet(viewsets.ReadOnlyModelViewSet, mixins.CreateModelMixin):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = settings.api_settings.DEFAULT_FILTER_BACKENDS
    ordering = ("-pkid",)

    def filter_queryset(self, queryset):
        parent_id = self.request.parser_context["kwargs"]["parent_lookup_group_id"]
        return super().filter_queryset(queryset.filter(group_id=parent_id))


class UserGroupViewSet(viewsets.ReadOnlyModelViewSet, mixins.CreateModelMixin):
    queryset = UserGroup.objects.all()
    serializer_class = CreateUserGroupSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = settings.api_settings.DEFAULT_FILTER_BACKENDS
    ordering = ("-pkid",)

    @action(methods=["delete"], detail=False, url_path="remove")
    def remove_user_from_group(self, request, *args, **kwargs):
        parent_id = self.request.parser_context["kwargs"]["parent_lookup_group_id"]
        self.get_queryset().filter(group_id=parent_id, user_id=request.data.get("user_id")).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
