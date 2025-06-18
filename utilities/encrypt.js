const CryptoJS = require("crypto-js")
const crypto = require('crypto')



// Function to AES Key recieved from the User using Server's Private Key
function decryptRSA(AES){
    const buffer = Buffer.from(AES, 'base64')
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



// USED ONLY FOR TESTING
// Function to encrypt AES Key using Server's Public Key
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



// Function used to encrypt data using AES Key and iv
function encrypt(data, iv, AESKey) {
    let ciphertext = CryptoJS.AES.encrypt(data, AESKey,{iv}).toString();
    return ciphertext
}



// Function used to decrypt data using AES Key and iv (optional)
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


// Funciton to generate random IV
function getIV(){
    return CryptoJS.lib.WordArray.random(16);
}


// Function to generate Hash values for field values
function getHashValue(data){
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