
const express = require('express');

const router = express.Router();

const {decryptRSA, getKeys} = require("../utilities/encrypt");
const { storeSession} = require('../utilities/sessionService');
const fs = require('fs');
const publicKey = fs.readFileSync('./utilities/public.pem', 'utf8');

/*
GET - /keys/
To get Server's public RSA key.
*/
router.get('/', (req, res) => {
    res.send({ success: true, publicKey: publicKey})
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