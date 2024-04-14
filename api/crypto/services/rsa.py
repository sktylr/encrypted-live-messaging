import logging
from datetime import timedelta
from typing import Optional

from cryptography import x509
from cryptography.hazmat import backends
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from django.utils import timezone

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def load_key() -> rsa.RSAPrivateKey:
    try:
        with open("key.pem", "rb") as key_file:
            private_key = serialization.load_pem_private_key(key_file.read(), password=None)
            return private_key
    except (Exception,):
        # Key has not been saved to a file yet
        private_key = generate_private_key()
        pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption(),
        )
        with open("key.pem", "wb") as key_file:
            key_file.write(pem)
        return private_key


def generate_private_key(key_size: Optional[int] = None, public_exponent: Optional[int] = None) -> rsa.RSAPrivateKey:
    key_size = key_size or 4096
    public_exponent = public_exponent or 65537
    private_key = rsa.generate_private_key(
        public_exponent=public_exponent,
        key_size=key_size,
        backend=backends.default_backend(),
    )
    return private_key


def generate_x509_cert_pem() -> str:
    rsa_key = load_key()
    certificate = _generate_x509_cert(rsa_key)
    return certificate.public_bytes(serialization.Encoding.PEM).decode()


def encrypt(
    plaintext: bytes, public_key: rsa.RSAPublicKey, _padding: Optional[padding.AsymmetricPadding] = None
) -> bytes:
    _padding = _padding or _get_padding()
    ciphertext = public_key.encrypt(plaintext, _padding)
    return ciphertext


def load_public_key_from_text(key: str) -> rsa.RSAPublicKey:
    return serialization.load_pem_public_key(key.encode())


def verify_public_key(public_key: bytes, certificate: bytes) -> Optional[x509.Certificate]:
    public_key = load_pem_public_key(public_key, backend=backends.default_backend())
    certificate = x509.load_pem_x509_certificate(certificate, backend=backends.default_backend())
    try:
        public_key.verify(
            certificate.signature,
            certificate.tbs_certificate_bytes,
            padding.PKCS1v15(),
            certificate.signature_hash_algorithm,
        )
    except Exception as e:
        logger.error(f"Unable to verify public key: {e}")
        return None
    return certificate


def sign_message(message: bytes) -> bytes:
    private_key = load_key()
    return private_key.sign(message, padding.PSS(salt_length=20, mgf=padding.MGF1(hashes.SHA256())), hashes.SHA256())


def _generate_x509_cert(private_key: rsa.RSAPrivateKey) -> x509.Certificate:
    builder = x509.CertificateBuilder()
    builder = builder.subject_name(x509.Name([x509.NameAttribute(x509.oid.NameOID.COMMON_NAME, "localhost")]))
    builder = builder.issuer_name(
        x509.Name(
            [
                x509.NameAttribute(x509.oid.NameOID.COMMON_NAME, "localhost"),
            ]
        )
    )
    now = timezone.now()
    builder = builder.not_valid_before(now)
    builder = builder.not_valid_after(now + timedelta(weeks=52))
    builder = builder.serial_number(x509.random_serial_number())
    builder = builder.public_key(private_key.public_key())
    builder = builder.add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost")]), critical=False)
    builder = builder.add_extension(
        x509.BasicConstraints(ca=False, path_length=None),
        critical=True,
    )
    certificate = builder.sign(
        private_key=private_key,
        algorithm=hashes.SHA256(),
        rsa_padding=padding.PSS(salt_length=20, mgf=padding.MGF1(hashes.SHA256())),
    )
    return certificate


def _get_padding() -> padding.AsymmetricPadding:
    return padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
