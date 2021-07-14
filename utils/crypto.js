const crypto = require('crypto');
const cryptoConfig = require('../config/crypto.config.js')

const algorithm = 'aes-256-ctr';
const iv = cryptoConfig.iv;

const pass_key = cryptoConfig.privateKey;
const salt = 'salt';
const keylen = 32;
const secretKey = crypto.scryptSync(pass_key, salt, keylen);

const encrypt = async (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
};
const decrypt = async (encrypted) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);

    const decrpyted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');;

    return decrpyted;
};

const encryptObj = async (data) => {
    let encryptedObj = {};
    Object.entries(data).map(async ([key, value]) => {
        if (typeof value == 'string') encryptedObj[key] = await encrypt(value)
    })

    return encryptedObj;
};

const decryptObj = async (data) => {
    let decryptObj = {}
    Object.entries(data).map(async([key, value]) => {
        if (typeof value == 'string') decryptObj[key] = await decrypt(value)
    })

    return decryptObj;
};

module.exports = {
    encrypt,
    decrypt,
    encryptObj,
    decryptObj
};