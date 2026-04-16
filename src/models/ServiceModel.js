const mongoose = require("mongoose")
const Schema = mongoose.Schema

const serviceSchema = new Schema({

    serviceName: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },


    description: {
        type: String,
        required: true
    }



})

module.exports = mongoose.model("service", serviceSchema)