from cryptography.fernet import Fernet
import base64
import os

# Generate a 32-byte random key
random_key = os.urandom(32)

# Encode the key in base64
base64_encoded_key = base64.urlsafe_b64encode(random_key)

# Convert the bytes to a string for better visibility
encoded_key_str = base64_encoded_key.decode('utf-8')

print("Generated 32-byte random key (base64 encoded):", encoded_key_str)
