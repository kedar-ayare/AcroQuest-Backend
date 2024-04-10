const jwt = require("jsonwebtoken");
const decrypt = require("../utilities/decrypt")

async function tokenVerify(req, res, next) {
    if (req.headers.token === undefined) {
        req.auth = { isAuthenticated: false }
        res.json({ err: "ValErr-01" })
    } else {
        try {
            const attatchedToken = await decrypt(req.headers.token);
            try {
                const decoded = jwt.verify(attatchedToken, process.env.JWT_SECRETE);
                req.User = decoded.id;
                return next();
            } catch (err) {
                console.log(err)
                res.json({ err: "ValErr-02" })
            }
        } catch (err) {
            console.log(err)
            res.json({ err: err })
        }
    }
}



module.exports = tokenVerify;