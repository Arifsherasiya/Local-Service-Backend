const mongoose = require("mongoose")
const Schema = mongoose.Schema

const paymentSchema = new Schema({

    bookingId: {
        type: mongoose.Types.ObjectId,
        ref: "booking",
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String,
        required: true
    },
    razorpaySignature: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },


}, { timestamps: true })
module.exports = mongoose.model("payment", paymentSchema)