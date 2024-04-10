const express = require('express');

const router = express.Router();
const Users = require("../models/User")
const Acro = require("../models/Acro")

const tokenVerify = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');
const decrypt = require("../utilities/decrypt")
const encrypt = require("../utilities/encrypt")



router.post('/', tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/" + req.body);

    var body = req.body
    if (body.acro !== null && body.full_form !== null && body.description !== null &&
        body.acro !== "" && body.full_form !== "" && body.description !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const newAcro = Acro({
                acro: await decrypt(req.body.acro),
                full_form: await decrypt(req.body.full_form),
                description: await decrypt(req.body.description),
                author: req.User
            })
            newAcro.save()
            await Users.findOneAndUpdate(
                { _id: req.User },
                {
                    $push: { contri: newAcro._id }
                }
            )
            res.send({ err: "OK" })
        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({ err: "NewAcro-02" })
        }
        session.endSession()

    } else {
        res.send({ err: "NewAcro-01" })
    }

})


router.post('/like/:id', tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/like/" + req.params.id);

    if (req.params.id !== null && req.params.id !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            await Acro.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $inc: { likes: 1 },
                    $push: { likedby: req.User }
                },
                { new: true }

            )

            await Users.findOneAndUpdate(
                { _id: req.User },
                {
                    $push: { liked: req.params.id }
                },
                { new: true }
            )
            res.send({ err: "OK" })
        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({ err: "LikeError-02" })
        }
    } else {
        res.send({ err: "LikeError-01" })
    }
})

router.post('/dislike/:id', tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/dislike/" + req.params.id);

    if (req.params.id !== null && req.params.id !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            await Acro.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $inc: { likes: -1 },
                    $pull: { likedby: req.User }
                },
                { new: true }

            )

            await Users.findOneAndUpdate(
                { _id: req.User },
                {
                    $pull: { liked: req.params.id }
                },
                { new: true }
            )
            res.send({ err: "OK" })
        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({ err: "LikeError-02" })
        }
    } else {
        res.send({ err: "LikeError-01" })
    }
})

router.get('/search/:id', tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/search/" + req.params.id);

    const str = req.params.id.toLowerCase()
    var acros = await Acro.find({
        $or: [
            { acro: { $regex: str, $options: 'i' } },
            { full_form: { $regex: str, $options: 'i' } },
            { description: { $regex: str, $options: 'i' } }
        ]
    })
    acros.sort((a, b) => {
        if (a.acro.toLowerCase().includes(str)) return -1;
        else if (b.acro.toLowerCase().includes(str)) return 1;
        else if (a.full_form.toLowerCase().includes(str)) return -1;
        else if (b.full_form.toLowerCase().includes(str)) return 1;
        else if (a.description.toLowerCase().includes(str)) return -1;
        else if (b.description.toLowerCase().includes(str)) return 1;
        else return 0;
    });
    res.send({
        err: "OK",
        data: acros
    })
})


router.post('/test', async (req, res) => {
    res.send({
        acro: await encrypt("UPSC"),
        full_form: await encrypt("Union Public Service Commission"),
        description: await encrypt("An entrance exam in India for public services job"),
    })
})
module.exports = router