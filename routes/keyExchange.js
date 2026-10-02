
const express = require('express');

const router = express.Router();

const {decryptRSA, getKeys} = require("../utilities/encrypt");
const { storeSession} = require('../utilities/sessionService');
const fs = require('fs');
const RequestId = require('../middlewares/request');
const { error } = require('console');
const publicKey = fs.readFileSync('./utilities/public.pem', 'utf8');

/*
GET - /keys/
Sends Server's public RSA key to Requesting App
Requires:
Sends: 
    - success: Request Success
    - publicKey: Public RSA Key
*/
router.get('/', RequestId,(req, res) => {
    console.log(req.RequestId + ":" + req.ip + "- GET: " + "/keys/");
    res.send({ success: true, publicKey: publicKey})
})


/*
POST - /keys/
Stores received AES key from requesting app
and creates a session
Requires:
    - AES: User's AES Key
Sends:
    - success: Request Success
    - sessionId: Session Id
*/
router.post('/',RequestId,async (req, res) => {

    console.log(req.RequestId + ":" + req.ip + "- POST: " + "/keys/");
    
    // Decrypt AES Key recieved
    const AESKey = decryptRSA(req.body.AES)
    
    // Send session Id
    const [sessionId, expiresAt] = await storeSession(AESKey, req)
    res.send({ success: true, sessionId: sessionId, expiresAt:expiresAt, error: null})
})




module.exports = router