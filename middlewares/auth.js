const jwt = require("jsonwebtoken");
const decrypt = require("../utilities/decrypt")


// To check for Tokens that are valid and not malformed
async function tokenVerify(req, res, next) {
    
    // Checks if Token is attached
    if (req.headers.token === undefined) {
        req.auth = { isAuthenticated: false }
        res.json({success: false, error: "ValError-01", msg: "No Token found"  })
    } else {
        try {

            // Decrypting Token to validate
            const attatchedToken = await decrypt(req.headers.token);
            try {

                // Verifying Token wiht JWT_Secrete in .env
                const decoded = jwt.verify(attatchedToken, process.env.JWT_SECRETE);
                req.User = decoded.id;
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