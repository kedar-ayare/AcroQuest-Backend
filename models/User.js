const mongoose = require("mongoose")

const User = mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
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