const crypto = require('crypto');

function decrypt(encryptedData, key) {
    console.log("entered")
    const decipher = crypto.createDecipheriv('aes-128-ecb', key, Buffer.alloc(0));

    let decryptedData = decipher.update(Buffer.from(encryptedData, 'base64'), 'binary', 'utf8');
    decryptedData += decipher.final('utf8');

    console.log(decryptedData);

    // Unpad the decrypted data
    // const lastCharCode = decryptedData.charCodeAt(decryptedData.length - 1);
    // decryptedData = decryptedData.slice(0, -lastCharCode);

    return decryptedData;
}

// Example usage
const encryptedData = 'jEYxoTYpOc5QEvy9E2xS9j3mEEosz/ccJ4tclU8grDcm1sSZN/diEq2ICS86uOwDFyAF555QvXkVfdfK5GTofIO7Gpso5P6csXN/qf+zzKI7ZCwkRELdMMHM8SClhbMzLzOGJDfQe86QleoukhTtLaZ9Uzt7uP4UfozI/8kAp7zrjkvRJPo0VCiR8Zh6LM+5Q6FyWyaYvr3NNEuUeeYDfDSwftEnEHx/7QgceVvbZOw=';  // Replace with the actual encrypted data
const decryptionKey = Buffer.from('b70b4dd780c2100fe9bfbdc71577ff64', 'hex');  // Use the same key generated in Python

const decryptedData = decrypt(encryptedData, decryptionKey);
console.log(decryptedData);
