from rest_framework.routers import DefaultRouter

from . import views

app_name = "crypto"

router = DefaultRouter()

router.register(r"rsa", views.RSAViewSet, basename="rsa")
router.register(r"aes", views.SymmetricKeyViewSet, basename="aes")

urlpatterns = router.urls
