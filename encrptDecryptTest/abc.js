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
const encryptedData = 'Oq87kO5NRL6smCGfHxU6PEBc2ZiyeWkiqU4QEroJqbs=';  // Replace with the actual encrypted data
const decryptionKey = Buffer.from('b70b4dd780c2100fe9bfbdc71577ff64', 'hex');  // Use the same key generated in Python

const decryptedData = decrypt(encryptedData, decryptionKey);
console.log(decryptedData);
