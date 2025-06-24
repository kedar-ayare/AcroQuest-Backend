const jwt = require("jsonwebtoken");
const { decrypt }= require("../utilities/encrypt")
const { setUserId, getAESKey } = require('../utilities/sessionService');


// To check for Tokens that are valid and not malformed
async function tokenVerify(req, res, next) {
    
    // Checks if Token is attached
    if (req.headers.token === undefined) {
        req.auth = { isAuthenticated: false }
        res.json({success: false, error: "ValError-01", msg: "No Token found"  })
    } else {
        try {
            const AESKey = await getAESKey(req.headers.sessionid)
            req.AESKey = AESKey
            console.log(req.AESKey)
            // Decrypting Token to validate
            const attatchedToken = req.headers.token;
            console.log(attatchedToken)
            try {

                // Verifying Token wiht JWT_Secrete in .env
                const decoded = jwt.verify(attatchedToken, process.env.JWT_SECRETE);
                req.User = decoded.id;
                setUserId(req.sessionId, req.User)
                return next();
            } catch (err) {
                console.log(err)
                res.json({ success: false, error: "ValError-02", msg: "Error verifying the token" })
            }
        } catch (err) {
            console.log(err)
            res.json({ success: false, error: "ValError-02", msg: "Error verifying the token" })
        }
    }
}



module.exports = tokenVerify;