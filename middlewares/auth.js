const jwt = require("jsonwebtoken");
const decrypt = require("../utilities/decrypt")

async function tokenVerify(req, res, next) {
    // console.log(req.headers)
    if (req.headers.token === undefined) {
        req.auth = { isAuthenticated: false }
        res.json({ err: "ValErr-01" })
    } else {
        try {
            // console.log("hello")
            // console.log(req.headers.token)
            const attatchedToken = await decrypt(req.headers.token);
            // const attatchedToken = req.headers.token;
            console.log("token after decrypt: ", attatchedToken)

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