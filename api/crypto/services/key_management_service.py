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
    """Generate a new AES key and create a new entry in the database for it, linking it to the relevant group"""
    key = generate_random_key()
    key = base64.b64encode(key).decode("utf-8")  # base 64 encoding for easier storage
    return SymmetricKey.objects.create(
        group=group,
        key=key,
    )


def verify_and_create_public_key(public_key: str, x509_pem: str, user: User) -> AsymmetricPublicKey:
    """Verifies a public key and if successful saves it to the database"""
    certificate = verify_public_key(public_key.encode(), x509_pem.encode())
    if not certificate:
        # here certificate is `None`, so could not be verified and we raise a validation error to return a HTTP 400
        # response to the client
        raise ValidationError(detail="Could not validate public key!")
    return AsymmetricPublicKey.objects.create(
        user=user,
        public_key=public_key,
        x509_pem=x509_pem,
        not_before=certificate.not_valid_before_utc.date(),
        not_after=certificate.not_valid_after_utc.date(),
    )


def get_key_for_group_and_user(user: User, group_id: Optional[str | UUID]) -> Tuple[str, str, str | UUID]:
    """Fetch the latest key for a group and encrypt it for the user using their public RSA key"""
    if not group_id:
        raise ValidationError(detail="Group id not provided")
    if not user.usergroup_set.filter(group_id=group_id):
        # user is not a member of the group and cannot receive the AES key
        raise ValidationError(detail="User is not a member of the group!")
    now = timezone.now().date()
    rsa_key = (
        AsymmetricPublicKey.objects.filter(user=user, not_before__lte=now, not_after__gte=now).order_by("-pkid").first()
    )
    if not rsa_key:
        # the user may have access to the group, but we don't have an RSA key stored for them that is valid
        raise ValidationError(detail="Public RSA key not found for user!")
    symmetric_key = SymmetricKey.objects.filter(group_id=group_id).order_by("-pkid").first()  # grab the latest AES key
    encrypted_key, signature = _encrypt_aes_key(symmetric_key.key, rsa_key.public_key)  # get ciphertext and signature
    return encrypted_key, signature, symmetric_key.id


def _encrypt_aes_key(aes_key: str, rsa_key: str) -> Tuple[str, str]:
    """
    Encrypt an AES key using an RSA public key and then produce a signature of the ciphertext using the server's RSA
    private key
    """
    public_key = load_public_key_from_text(rsa_key)
    encrypted_key = encrypt(aes_key.encode(), public_key)
    # signing is performed after encryption to ensure that an eavesdropper cannot decrypt the signature using the
    # server's public key and find the AES key
    signature = sign_message(encrypted_key)
    return base64.b64encode(encrypted_key).decode(), base64.b64encode(signature).decode()
