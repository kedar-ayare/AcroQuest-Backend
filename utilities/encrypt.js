const CryptoJS = require("crypto-js")
const crypto = require('crypto')
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync('./utilities/private.pem', 'utf8');
const publicKey = fs.readFileSync('./utilities/public.pem', 'utf8');



// Function to AES Key recieved from the User using Server's Private Key
function decryptRSA(encryptedBase64) {
    const buffer = Buffer.from(encryptedBase64, 'base64');
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha1',
        },
        buffer
    );
    return decrypted.toString('utf8');
}



// USED ONLY FOR TESTING
// Function to encrypt AES Key using Server's Public Key
function encryptRSA(data) {
    const buffer = Buffer.from(data);
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha1"
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



function getKeys(){
    crypto.generateKeyPair(
        'rsa',
        {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',     // Recommended for public keys
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',    // Recommended for private keys
                format: 'pem',
            },
        },
        (err, publicKey, privateKey) => {
            if (err) throw err;

            // Save to files
            const pubPath = path.join(__dirname, 'public.pem');
            const privPath = path.join(__dirname, 'private.pem');

            fs.writeFileSync(pubPath, publicKey);
            fs.writeFileSync(privPath, privateKey);

            console.log('✅ RSA key pair generated and saved:');
            console.log('🔐 Private Key:', privPath);
            console.log('🔓 Public Key:', pubPath);
        }
        );
}
module.exports = {
    encrypt,
    decrypt,
    getIV,
    getHashValue,
    encryptRSA,
    decryptRSA,
    getKeys
};