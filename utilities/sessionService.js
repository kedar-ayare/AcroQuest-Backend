// sessionService.js
const crypto = require('crypto');
const Session = require('../models/Session');

const SESSION_TTL = 60 * 60 * 24; // 24 hours


// Function to Create a new session using AES key recieved
async function storeSession(AES, req) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 *60*60*24)

    const session = await Session.create({
        sessionId,
        expiresAt,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        AES: AES,
    });
    session.save()
    return sessionId;

}

async function setUserId(sessionId, userId){
    const session = await Session.findOneAndUpdate(
        {sessionId: sessionId},
        {userId: userId},
        {new: true}
    )
}


// Function to get AES Key using a session Id
async function getAESKey(sessionId) {
    const session = await Session.findOne({sessionId: sessionId})
    if(session){
        return session.AES
    }
    return undefined
}

module.exports = {
    storeSession,
    getAESKey,
    deleteSession,
    setUserId
};
