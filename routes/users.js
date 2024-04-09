const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

// const tokenVerify = require("../middlewares/auth");
const { config } = require('dotenv');
const tokenVerify = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');
const decrypt = require("../utilities/decrypt")
const encrypt = require("../utilities/encrypt")

router.post('/', async (req, res) => {
    if (req.body.uname !== null && req.body.password !== null && req.body.email !== null &&
        req.body.uname !== "" && req.body.password !== "" && req.body.email !== "") {

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newUser = Users({
                uname: await decrypt(req.body.uname),
                password: await decrypt(req.body.password),
                email: await decrypt(req.body.email)
            })
            await newUser.save();
            const token = await encrypt(jwt.sign({ id: newUser._id }, process.env.JWT_SECRETE, { expiresIn: '90d' }))
            res.send({ token })
        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "NewUser-01" })
        }
        session.endSession()

    } else {
        res.send({ err: "NewUser-02" })
    }

})

router.post('/login', async (req, res) => {
    if (req.body.uname !== null && req.body.password !== null &&
        req.body.uname !== "" && req.body.password !== "") {

        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            const user = await Users.findOne({ uname: await decrypt(req.body.uname) })
            if (user.password == await decrypt(req.body.password)) {
                const token = await encrypt(jwt.sign({ id: user._id }, process.env.JWT_SECRETE, { expiresIn: '90d' }))
                res.send({ token })
            } else {
                res.send({ err: "LogError-03" })
            }

        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({ err: "LogError-02" })
        }

        session.endSession()


    } else {
        res.send({ err: "LogError-01" })
    }
})

router.get('/', tokenVerify, async (req, res) => {

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const user = await Users.findOne({ _id: req.User }).populate("contri")
        if (user != null) {
            res.send({ user })
        } else {
            res.send({
                err: "GetUserErr-02"
            })
        }
    } catch (err) {
        console.log(err)
        session.abortTransaction()
        res.send({ err: "GetUserErr-01" })
    }
    session.endSession()
})

router.post('/test', async (req, res) => {
    res.send({
        uname: await encrypt("kedarayare"),
        email: await encrypt("kedar@ayare.com"),
        password: await encrypt("kedarayare")
    })
})

module.exports = router