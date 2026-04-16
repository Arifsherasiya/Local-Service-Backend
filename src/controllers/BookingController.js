const bookingSchema = require("../models/BookingModel");
const ProviderServiceModel = require("../models/ProviderService Model");


const createBooking = async (req, res) => {
    try {
        const { customerId, providerServiceId, bookingDate, timeSlot, address } = req.body;

        const ps = await ProviderServiceModel.findById(providerServiceId);
        if (!ps) {
            return res.status(404).json({ message: "Provider service not found" });
        }

        const newBooking = await bookingSchema.create({
            customerId: req.user._id,
            providerServiceId,
            bookingDate,
            timeSlot,
            address,
            status: "Pending",
        });

        res.status(201).json({
            message: "Booking created successfully",
            data: newBooking,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating booking", error: err.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await bookingSchema
            .find({ customerId: req.user._id })
            .populate({
                path: "providerServiceId",
                populate: [
                    { path: "serviceId", select: "serviceName" },
                    { path: "providerId", select: "firstName lastName profilePic" }
                ]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Bookings fetched successfully",
            total: bookings.length,
            data: bookings,
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching bookings",
            error: err.message,
        });
    }
};


// ✅ GET BOOKINGS FOR PROVIDER
const getProviderBookings = async (req, res) => {
    try {
        const providerId = req.user._id; // ✅ from token

        const bookings = await bookingSchema
            .find()
            .populate({
                path: "providerServiceId",
                match: { providerId: providerId }, // ✅ filter provider
                populate: [
                    { path: "serviceId", select: "serviceName" },
                    { path: "providerId", select: "firstName" }
                ]
            })
            .populate("customerId", "firstName lastName")
            .lean();

        // ❗ remove null (other provider bookings)
        const filtered = bookings.filter(b => b.providerServiceId !== null);

        res.status(200).json({
            message: "Provider bookings fetched",
            data: filtered
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching provider bookings",
            error: err.message
        });
    }
};

const getBookingDetails = async (req, res) => {
    try {
        const booking = await bookingSchema
            .findById(req.params.id)
            .populate("customerId", "firstName lastName email")
            .populate({
                path: "providerServiceId",
                populate: [
                    { path: "serviceId", select: "serviceName description" },
                    { path: "providerId", select: "firstName lastName phone profilePic" }
                ]
            });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({
            message: "Booking details fetched",
            data: booking
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching booking",
            error: err.message
        });
    }
};


const getAllBooking = async (req, res) => {
    try {
        const bookings = await bookingSchema
            .find()

            // ✅ CUSTOMER
            .populate({
                path: "customerId",
                select: "firstName lastName email phone"
            })

            // ✅ PROVIDER SERVICE
            .populate({
                path: "providerServiceId",
                populate: [
                    {
                        path: "serviceId",
                        select: "serviceName"
                    },
                    {
                        path: "providerId", // ✅ ONLY ONE LEVEL
                        select: "firstName lastName email phone"
                    }
                ]
            });

        res.status(200).json({
            message: "Bookings fetched",
            data: bookings
        });

    } catch (err) {
        console.log("🔥 ERROR:", err);
        res.status(500).json({
            message: "Error fetching bookings",
            error: err.message
        });
    }
};

const getBookingById = async (req, res) => {

    try {
        const foundBooking = await bookingSchema
            .findById(req.params.id)
            .populate({
                path: "customerId",
                select: "name email"
            })
            .populate({
                path: "providerServiceId"
            });

        if (foundBooking) {
            res.status(200).json({
                message: "Booking found",
                data: foundBooking
            })
        }
        else {
            res.status(404).json({
                message: "Booking not found",
            })
        }
    }

    catch (err) {
        res.status(500).json({
            message: "error while fetching booking",
            err: err
        })
    }
};

const updateBooking = async () => {
    try {
        await axios.put(
            `http://localhost:3000/booking/update/${editingBooking._id}`,
            {
                bookingDate,
                timeSlot,
                address
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        alert("✏️ Booking Updated");

        setEditingBooking(null);

    } catch (err) {
        console.error(err);
    }
};


// ✅ DELETE BOOKING
const cancelBooking = async (req, res) => {
    try {
        const booking = await bookingSchema.findByIdAndUpdate(
            req.params.id,
            { status: "Cancelled" },
            { new: true }
        );

        res.status(200).json({
            message: "Booking cancelled",
            data: booking
        });

    } catch (err) {
        res.status(500).json({
            message: "Error cancelling booking",
            error: err.message
        });
    }
};



const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await bookingSchema.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // ✅ VALID FLOW CONTROL (VERY IMPORTANT)
        const validTransitions = {
            "Pending": ["Confirmed", "Cancelled"],
            "Confirmed": ["In Progress"],
            "In Progress": ["Completed"],
            "Completed": [],
            "Cancelled": []
        };

        if (!validTransitions[booking.status].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from ${booking.status} to ${status}`
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            message: "Status updated successfully",
            data: booking
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating status",
            error: err.message
        });
    }
};


module.exports = {
    createBooking,
    getMyBookings,
    getProviderBookings,
    getBookingDetails,
    getAllBooking,
    getBookingById,
    updateBooking,
    cancelBooking,
    updateBookingStatus
}