const express = require('express')
const router = express.Router();

const Users = require("../models/User")

const {decrypt, encrypt, encryptRSA, getIV} = require("../utilities/encrypt");
const { getAESKey } = require('../utilities/sessionService');

router.get('/', async (req, res)=> {
    const user = await Users.findOne({ _id:req.body.id})
    const iv = getIV()
    const AESKey= await getAESKey(req.headers.sessionid)
    const encrypted ={
        uname: encrypt("kedarayare", iv, AESKey),
        password: encrypt("kedarayare", iv, AESKey),
        email: encrypt("kedarayare@gmail.com", iv, AESKey),
        acro: encrypt("test1",iv,AESKey),
        full_form: encrypt("test2", iv, AESKey),
        description: encrypt("test3", iv, AESKey),
        uname: encrypt("kedarayare", iv, AESKey)
    }

    res.send({encrypted})
})



router.get('/getRSAEncryptedAES', async (req, res) => {
    const encrypted = encryptRSA("AQpduXNLmopV5RyNY9yRUqT8+cCT948wAWYGenncTxM=")
    res.send({"RSAEncryptedAES": encrypted})
})




router.get('/testDecrypt', async (req, res) => {
    const iv = getIV();

    const encrypted = encrypt("kedar",  iv,"kedarayare")
    console.log(encrypted)
    console.log(decrypt(encrypted, "kedarayare", iv))
    res.send({err:"Ok"})
})

module.exports = router