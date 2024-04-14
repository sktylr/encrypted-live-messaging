import os


def generate_random_key() -> bytes:
    return os.urandom(32)  # 32 * 8 = 256 bits
