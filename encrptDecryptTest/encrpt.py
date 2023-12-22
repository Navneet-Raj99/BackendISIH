from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64

def encrypt(data, key):
    block_size = AES.block_size
    padded_data = data + (block_size - len(data) % block_size) * chr(block_size - len(data) % block_size)

    cipher = AES.new(key, AES.MODE_ECB)
    ciphertext = cipher.encrypt(padded_data.encode('utf-8'))

    return base64.b64encode(ciphertext)

# Example usage
data_to_encrypt = "Hello, Encryption!"

binary_key = bytes.fromhex("b70b4dd780c2100fe9bfbdc71577ff64")
encryption_key = get_random_bytes(16)  # 16 bytes for AES-128, adjust as needed

encrypted_data = encrypt(data_to_encrypt, binary_key)
print(encrypted_data.decode('utf-8'))

print("navneet")


# Oq87kO5NRL6smCGfHxU6PEBc2ZiyeWkiqU4QEroJqbs=

# print((encryption_key))
print((encryption_key.hex()))




# print(result_string)

