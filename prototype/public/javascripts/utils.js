// Nodejs encryption with CTR
const crypto = require('crypto');
const { algorithm, key, iv } = require('../../config.json');

const encrypt = (text) => { // Buffer.from(key)
    text = JSON.stringify(text);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

const decrypt = (text) => {
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
