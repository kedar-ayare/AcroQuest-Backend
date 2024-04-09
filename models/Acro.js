const mongoose = require("mongoose")

const Acro = mongoose.Schema({
    acro: {
        type: String,
        required: true
    },
    full_form: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },

    likedby: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    likes: {
        type: Number,
        required: 0,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model("Acro", Acro)