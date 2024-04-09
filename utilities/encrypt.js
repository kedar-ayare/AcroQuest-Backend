const crypt = require("react-native-crypto-js")


async function encrypt(data) {
    let ciphertext = crypt.AES.encrypt(data, 'kedarayare').toString();
    return ciphertext
}

module.exports = encrypt;