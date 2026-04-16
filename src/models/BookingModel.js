const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookingSchema = new Schema({

    customerId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },

    providerServiceId: {
        type: mongoose.Types.ObjectId,
        ref: "providerService",
        required: true},

    bookingDate: {
        type: Date,
        required: true
    },

    timeSlot: {
        type: String,
        required: true
    },

   status: {
        type: String,
        enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
        default: "Pending"
    },

    address: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("booking", bookingSchema)