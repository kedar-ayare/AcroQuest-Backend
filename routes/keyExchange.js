
const express = require('express');

const router = express.Router();

const {encryptRSA, decryptRSA} = require("../utilities/encrypt");
const { storeSession, getAESKey } = require('../utilities/sessionService');

// To send Server's Public Key to the User
router.get('/', (req, res) => {
    res.send({ success: true, publicKey: process.env.RSA__Public_Key})
})


// Recieve's User's AES Key, encrypted by Server's Public Key
// Decrypts it Using Server's Private Key and sotres in a session
// Returns Session ID
router.post('/',async (req, res) => {
    // Decrypt AES Key recieved
    const AESKey = decryptRSA(req.body.AES)
    
    // Send session Id
    res.send({ success: true, sessionId: await storeSession(AESKey, req)})
})




module.exports = router