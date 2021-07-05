const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

    return encrypted;
};

const decrypt = (encrypted) => {

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);

    const decrpyted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); ;

    return decrpyted;
};

module.exports = {
    encrypt,
    decrypt
};