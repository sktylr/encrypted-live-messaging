import base64
from typing import Optional, Tuple
from uuid import UUID

from django.utils import timezone
from rest_framework.exceptions import ValidationError

from accounts.models import User
from messages.models import MessageGroup

from ..models import AsymmetricPublicKey, SymmetricKey
from .aes import generate_random_key
from .rsa import encrypt, load_public_key_from_text, sign_message, verify_public_key


def generate_key_for_group(group: MessageGroup) -> SymmetricKey:
    key = generate_random_key()
    key = base64.b64encode(key).decode("utf-8")
    return SymmetricKey.objects.create(
        group=group,
        key=key,
    )


def verify_and_create_public_key(public_key: str, x509_pem: str, user: User) -> AsymmetricPublicKey:
    certificate = verify_public_key(public_key.encode(), x509_pem.encode())
    if not certificate:
        raise ValidationError(detail="Could not validate public key!")
    return AsymmetricPublicKey.objects.create(
        user=user,
        public_key=public_key,
        x509_pem=x509_pem,
        not_before=certificate.not_valid_before_utc.date(),
        not_after=certificate.not_valid_after_utc.date(),
    )


def get_key_for_group_and_user(user: User, group_id: Optional[str | UUID]) -> Tuple[str, str, str | UUID]:
    if not group_id:
        raise ValidationError(detail="Group id not provided")
    if not user.usergroup_set.filter(group_id=group_id):
        raise ValidationError(detail="User is not a member of the group!")
    now = timezone.now().date()
    rsa_key = (
        AsymmetricPublicKey.objects.filter(user=user, not_before__lte=now, not_after__gte=now).order_by("-pkid").first()
    )
    if not rsa_key:
        raise ValidationError(detail="Public RSA key not found for user!")
    symmetric_key = SymmetricKey.objects.filter(group_id=group_id).order_by("-pkid").first()
    encrypted_key, signature = _encrypt_aes_key(symmetric_key.key, rsa_key.public_key)
    return encrypted_key, signature, symmetric_key.id


def _encrypt_aes_key(aes_key: str, rsa_key: str) -> Tuple[str, str]:
    public_key = load_public_key_from_text(rsa_key)
    encrypted_key = encrypt(aes_key.encode(), public_key)
    signature = sign_message(encrypted_key)
    return base64.b64encode(encrypted_key).decode(), base64.b64encode(signature).decode()
