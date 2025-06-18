const express = require('express');

const router = express.Router();
const Users = require("../models/User")
const Acro = require("../models/Acro")

const tokenVerify = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');
const validate = require('../middlewares/validation');

const {newAcroSchema} = require("../models/inputValidation");


/*
POST - /
To post a new Acronym.
Requires:
    - acro - Acronym
    - full_form - Full Form of the Acronym
    - description - description of the Acronym
*/
router.post('/',validate(newAcroSchema), tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/" + req.body);

    const session = await mongoose.startSession()
    session.startTransaction()
    try {

        // Creating the new Acro document in Mongo
        const newAcro = Acro({
            acro:  req.body.acro,
            full_form: req.body.full_form,
            description: req.body.description,
            author: req.User,
        })

        await newAcro.save({session})

        // Adding the new Acro Document Id to submitting User's 'contri' field
        await Users.findOneAndUpdate(
            { _id: req.User },
            {
                $push: { contri: newAcro._id }
            },
            {
                session,
                new: true
            }
        )
        await session.commitTransaction()
        res.send({ success: true })
    } catch (err) {
        console.log(err)
        session.abortTransaction()
        res.send({ success: false, err: "NewAcro-03", msg: "Error Saving the New Acronym" })
    } finally {
        session.endSession()
    }
    

})


/*
POST - /like/:id
To like an new Acronym.
Requires:
    - id: Id of the post to be liked
*/

router.post('/like/:id', tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/like/" + req.params.id);

    if (req.params.id !== null && req.params.id !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {

            // Incrementing like count and adding user id to 'likedby' field
            await Acro.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $inc: { likes: 1 },
                    $push: { likedby: req.User }
                },
                { 
                    session,
                    new: true 
                }

            )

            // Adding Acro Document Id to user's 'liked' field
            await Users.findOneAndUpdate(
                { _id: req.User },
                {
                    $push: { liked: req.params.id }
                },
                { 
                    session,
                    new: true 
                }
            )
            session.commitTransaction()
            res.send({ success: true })
        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({ success: false, err: "LikeError-01", msg:  "Post Id missing"})
        }
    } else {
        res.send({success: false, err: "LikeError-02", msg: "Error in interacting with the post" })
    }
})


/*
POST - /dislike/:id
To like an new Acronym.
Requires:
    - id: Id of the post to be disliked
*/

router.post('/dislike/:id', tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/dislike/" + req.params.id);

    if (req.params.id !== null && req.params.id !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {

            // Decrementing like count and removing user id from 'likedby' field
            await Acro.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $inc: { likes: -1 },
                    $pull: { likedby: req.User }
                },
                { 
                    session,
                    new: true 
                }

            )

            // Removing Acro Document Id from user's 'liked' field
            await Users.findOneAndUpdate(
                { _id: req.User },
                {
                    $pull: { liked: req.params.id }
                },
                { 
                    session,
                    new: true 
                }
            )
            session.commitTransaction()
            res.send({ success: true })
        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({success: false, err: "LikeError-01", msg: "Post Id missing" })
        }
    } else {
        res.send({ success: false, err: "LikeError-02", msg: "Error in interacting with the post" })
    }
})


/*
POST - /search/:id
To search an Acronym.
Requires:
    - id: search string as past of the url parameter
*/

router.get('/search/:id', tokenVerify, async (req, res) => {

    console.log(new Date() + ":" + req.ip + "- POST: " + "acro/search/" + req.params.id);


    if(req.params.id != null && req.params.id != "" && req.params.id.length > 1){
        const str = req.params.id.toLowerCase()

        try{

            // Matching string with all fields in the Acro document
            var acros = await Acro.find({
                $or: [
                    { acro: { $regex: str, $options: 'i' } },
                    { full_form: { $regex: str, $options: 'i' } },
                    { description: { $regex: str, $options: 'i' } }
                ]
            })

            // Sorting it in the preference - Acro -> Full Form -> Description
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
                success: true,
                data: acros
            })
        }catch(err){
            console.log(err)
            res.send({success:false,err: "SearchError-02", msg:"Error in searching the database" })
        }
        
    }else{
        res.send({success: false,error: "SearchError-01", msg: "Need Proper string to search"})
    }
    
})

module.exports = router