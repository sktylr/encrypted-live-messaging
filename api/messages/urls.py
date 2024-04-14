from rest_framework_extensions.routers import ExtendedDefaultRouter

from . import views

app_name = "messages"

router = ExtendedDefaultRouter()

groups_route = router.register(r"groups", views.MessageGroupViewSet, basename="groups")
groups_route.register(r"messages", views.MessageViewSet, basename="groups-message", parents_query_lookups=["group_id"])
groups_route.register(r"users", views.UserGroupViewSet, basename="groups-users", parents_query_lookups=["group_id"])

urlpatterns = router.urls
