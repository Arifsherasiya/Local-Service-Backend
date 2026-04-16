
const mongoose = require("mongoose");
const Schema = mongoose.Schema

const providerServiceSchema = new Schema({

    providerId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },

    serviceId: {
        type: mongoose.Types.ObjectId,
        ref: "service",
        required: true
    },
    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("providerService", providerServiceSchema)