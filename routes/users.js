const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const validate = require("../middlewares/validation")
const RequestId = require("../middlewares/request")

const {newUserSchema, loginUserSchema} = require("../models/inputValidation")

const tokenVerify = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');

const {encrypt, decrypt, getIV, getHashValue} = require("../utilities/encrypt")


/*
POST - /
To Create a New User.
Requires:
    - uname - Username of the New User
    - password - Password of the New User
    - email - Email of the New User
Sends:
    - success: Request Success
    - token: User Token
    - error: Error when processing the Request
*/
router.post('/', RequestId ,validate(newUserSchema),async (req, res) => {

    // Log entry
    console.log(req.RequestId + ":" + req.ip + "- POST: " + "users/ " + req.body);

    // Starting Mongo session and starting a transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    const iv = getIV();

    try {


        // Creating New User document
        const newUser = await Users({
            uname: encrypt(req.body.uname, iv, process.env.AESKey), 
            unameHash: getHashValue(req.body.uname),
            unameIV: iv,

            password: encrypt(req.body.password,iv,process.env.AESKey),
            passwordIV: iv,

            email: encrypt(req.body.email,iv,process.env.AESKey),
            emailHash: getHashValue(req.body.email),
            emailIV: iv,
        })
        await newUser.save({session});
        await session.commitTransaction();

        // Ecrypting and Sending User Token
        const token = encrypt(jwt.sign({ id: newUser._id }, process.env.JWT_SECRETE, { expiresIn: '90d' }), iv, req.AESKey)
        res.send({ success: true, token, error: null })
        session.endSession()
    } catch (err) {
        session.abortTransaction()
        console.log(req.RequestId + ":" + req.ip + " - Error: " + err.msg)
        res.send({success: false, error: "NewUser-01", msg: "Failed to Create a User" })
    }

})


/*
POST - /login
For users to login. Validates user creds and sends a jwt token
Requires:
    - uname - Username of the User
    - password - Password of the User 
Sends:
    - success: Request Success
    - token: User Token
    - error: Error when processing the Request
    - msg: message of the error
*/
router.post('/login', RequestId, validate(loginUserSchema) ,async (req, res) => {
    console.log(req.RequestId+ ":" + req.ip + "- POST: " + "users/login " + JSON.stringify(req.body));

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        // Checks if user exists
        const user = await Users.findOne({ unameHash: getHashValue(req.body.uname)})

        // checks for user and password
        if (user && decrypt(user.password, process.env.AESKey) == req.body.password) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, { expiresIn: '90d' })
            res.send({ success: true, token, error:null })
        } else {
            res.send({ success:false, error: "LogError-03", msg:  "No user found"})
        }

    } catch (err) {
        console.log(req.RequestId + ":" + req.ip + " - Error: "+err)
        session.abortTransaction()
        res.send({ success: false, error: "LogError-02" , msg: "Error Logging In"})
    }
    session.endSession()

})




/*
GET - /
To get user Info
Requires:
    - token - Auth Token as part of the req headers
Sends:
    - success: Request Success
    - user: User's encrypted details
    - error: Error when processing the Request
*/
router.get('/', RequestId,tokenVerify, async (req, res) => {

    console.log(req.RequestId + ":" + req.ip + "- GET: " + "users/" + req.User);

    // Starts mongo session
    const session = await mongoose.startSession()
    session.startTransaction()
    const iv = getIV();
    try {

        // Get's User document and populated the 'contri' field
        const user = await Users.findOne({ _id: req.User }).populate('contri')

        if (user != null) {
            
            // Decrypts object using Server AES key, encrypts using users AES key
            const encryptedUser = {
                uname: encrypt(decrypt(user.uname, process.env.AESKey, user.unameIV),iv, req.AESKey),
                contri: user.contri,
                email: encrypt(decrypt(user.email, process.env.AESKey, user.emailIV),iv, req.AESKey),
            }
            res.status(200).send({success: true, user: encryptedUser, error:null })

        } else {
            res.send({
                success: false,
                error: "GetUserErr-02",
                msg:"No such user found"
            })
        }
    } catch (err) {
        console.log(req.RequestId + ":" + req.ip + " - Error: "+err)
        session.abortTransaction()
        res.send({ success:false, error: "GetUserErr-01" , msg: "Error Getting the User Details"})
    }
    session.endSession()
})


module.exports = router