const Razorpay = require("razorpay")
const crypto = require("crypto")
require("dotenv").config()
const paymentSchema = require("../models/PaymentModel")
const RAZORPAY_KEY = process.env.RAZORPAY_KEY
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY,
    key_secret: RAZORPAY_SECRET
})

const createRazorPayOrder = async (req, res) => {
    try {
        console.log("BODY 👉", req.body);

        const { amount, bookingId } = req.body; // ✅ FIX

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: bookingId, // ✅ link booking here
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            bookingId // send back
        });

    } catch (err) {
        console.error("❌ RAZORPAY ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
const verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId,
        amount
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {

        // ✅ SAVE PAYMENT
        await paymentSchema.create({
            bookingId,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount,
            currency: "INR",
            status: "success"
        });

        // ✅ UPDATE BOOKING STATUS
        await paymentSchema.findByIdAndUpdate(
            bookingId,
            { status: "Confirmed" }
        );

        return res.json({ success: true });
    }

    res.status(400).json({ success: false });
};

module.exports = {
    createRazorPayOrder,
    verifyPayment
}