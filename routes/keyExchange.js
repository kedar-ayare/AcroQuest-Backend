
const express = require('express');

const router = express.Router();

const {decryptRSA} = require("../utilities/encrypt");
const { storeSession} = require('../utilities/sessionService');

/*
GET - /keys/
To get Server's public RSA key.
*/
router.get('/', (req, res) => {
    res.send({ success: true, publicKey: process.env.RSA__Public_Key})
})


/*
POST - /keys/
Recieves User's AES key and returns a session ID
Requires:
    - AES: User's AES Key
*/
router.post('/',async (req, res) => {
    // Decrypt AES Key recieved
    const AESKey = decryptRSA(req.body.AES)
    
    // Send session Id
    res.send({ success: true, sessionId: await storeSession(AESKey, req)})
})




module.exports = router