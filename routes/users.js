const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const validate = require("../middlewares/validation")

const {newUserSchema, loginUserSchema} = require("../models/inputValidation")

const tokenVerify = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');
const decrypt = require("../utilities/decrypt")
const encrypt = require("../utilities/encrypt")


/*
POST - /
To Create a New User.
Requires:
    - uname - Username of the New User
    - password - Password of the New User
    - email - Email of the New User
*/
router.post('/', validate(newUserSchema),async (req, res) => {
    console.log(new Date() + ":" + req.ip + "- POST: " + "users/ " + req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        // Creating New User document
        const newUser = Users({
            uname: req.body.uname,
            password: req.body.password,
            email: req.body.email
        })
        await newUser.save({session});
        await session.commitTransaction();

        // Ecrypting and Sending User Token
        const token = await encrypt(jwt.sign({ id: newUser._id }, process.env.JWT_SECRETE, { expiresIn: '90d' }))
        res.send({ success: true, token })
        session.endSession()
    } catch (err) {
        session.abortTransaction()
        console.log(err)
        res.send({success: false, error: "NewUser-01", msg: "Failed to Create a User" })
    }

})


/*
POST - /login
For user to login
Requires:
    - uname - USername of the User
    - password - Password of the User 
*/
router.post('/login', validate(loginUserSchema) ,async (req, res) => {
    console.log(new Date() + ":" + req.ip + "- POST: " + "users/login " + JSON.stringify(req.body));

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        // Checks if user exists
        const user = await Users.findOne({ uname:req.body.uname})

        // checks for user and password
        if (user && user.password == req.body.password) {
            const token = await encrypt(jwt.sign({ id: user._id }, process.env.JWT_SECRETE, { expiresIn: '90d' }))
            res.send({ success: true, token })
        } else {
            res.send({ success:false, error: "LogError-03", msg:  "No user found"})
        }

    } catch (err) {
        console.log(err)
        session.abortTransaction()
        res.send({ success: false, error: "LogError-02" , msg: "Error Logging In"})
    }

    session.endSession()

})




/*
GET - /
To get user Info
Requires:
    - token -Auth Token as part of the req headers
*/
router.get('/', tokenVerify, async (req, res) => {
    console.log(new Date() + ":" + req.ip + "- GET: " + "users/" + req.User);
    const session = await mongoose.startSession()
    session.startTransaction()
    try {

        // Get's User document and populated the 'contri' field
        const user = await Users.findOne({ _id: req.User }).populate("contri")
        if (user != null) {
            const encryptedData = await encrypt(JSON.stringify(user))
            res.send({success: true, encryptedData })
        } else {
            res.send({
                success: false,
                error: "GetUserErr-02",
                msg:"No such user found"
            })
        }
    } catch (err) {
        console.log(err)
        session.abortTransaction()
        res.send({ success:false, error: "GetUserErr-01" , msg: "Error Getting the User Details"})
    }
    session.endSession()
})

router.post('/test',validate(loginUserSchema),async (req, res) => {
    res.send({
        uname: await encrypt(req.body.uname),
        email: await encrypt("kedar@ayare.com"),
        password: await encrypt(req.body.password)
    })
})

module.exports = router