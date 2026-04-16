const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String
    },

    address: {
        type: String
    },

    role: {
        type: String,
        default: "user",
        enum: ["customer", "admin", "provider"]
    },

    profilePic: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "deleted", "blocked"]
    }

})


module.exports = mongoose.model("users", userSchema)