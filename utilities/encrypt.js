const CryptoJS = require("crypto-js")
const crypto = require('crypto')




function decryptRSA(AES){
    const buffer = Buffer.from(AES, 'base64')
    // console.log("Private Key =>",  process.env.RSA__Private_Key.replace(/\\n/g, '\n'))
    const decrypted = crypto.privateDecrypt(
        {
            key: process.env.RSA__Private_Key.replace(/\\n/g, '\n'),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        buffer
    )
    return decrypted.toString('utf8')
}


function encryptRSA(data) {
    const buffer = Buffer.from(data);
    const encrypted = crypto.publicEncrypt(
        {
            key: process.env.RSA__Public_Key.replace(/\\n/g, '\n'),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        buffer
    );
    return encrypted.toString('base64');
}









// ------------------------------------------------

function encrypt(data, iv, AESKey) {
    let ciphertext = CryptoJS.AES.encrypt(data, AESKey,{iv}).toString();
    return ciphertext
}


function decrypt(data, AESKey,iv = null) {
    let bytes;
    if(iv){
        bytes = CryptoJS.AES.decrypt(data, AESKey, {iv});
    }else{
        bytes = CryptoJS.AES.decrypt(data, AESKey);
    }
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
    
}

function getIV(){
    return CryptoJS.lib.WordArray.random(16);
}

function getHashValue(data){
    // console.log(crypt.SHA512)
    return CryptoJS.SHA256(data).toString()
}

module.exports = {
    encrypt,
    decrypt,
    getIV,
    getHashValue,
    encryptRSA,
    decryptRSA
};