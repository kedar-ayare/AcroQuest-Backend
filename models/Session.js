const mongoose = require("mongoose")

const session = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    ip: String,
    userAgent: String,
    AES:{
        type: String,
        required: true
    }
},{
    timestamps: true
}
)

// Auto-delete expired sessions
session.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", session)