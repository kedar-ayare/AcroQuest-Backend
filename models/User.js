const { required, types } = require("joi")
const mongoose = require("mongoose")

const User = mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    unameHash:{
        type: String,
        required: true
    },
    unameIV:{
        type:String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },
    passwordIV:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    emailHash:{
        type: String,
        required: true,
    },
    emailIV:{
        type: String,
        required: true
    },
    contri: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Acro"
        }
    ],
    liked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Acro"
        }
    ]
})

module.exports = mongoose.model("User", User)