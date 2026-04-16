const mongoose = require("mongoose")
const Schema = mongoose.Schema

const providerschema = new Schema({

    providerId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    },

    profilePic: {
        type: String
    },

    aadharCard: {
        type: String
    },
    

    experience: {
        type: String,
        required: true
    },
   

    verified: {
        type: Boolean,
        default: false
    }, // Admin verification status
}, { timestamps: true });

module.exports = mongoose.model("provider", providerschema)