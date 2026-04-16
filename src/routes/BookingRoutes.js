const router = require("express").Router()
const AuthMiddleware = require("../Middleware/AuthMiddleware")

const bookingController = require ("../controllers/BookingController")
router.post("/create",AuthMiddleware, bookingController.createBooking)
router.get("/my", AuthMiddleware, bookingController.getMyBookings);

// ✅ provider bookings
router.get("/provider", AuthMiddleware, bookingController.getProviderBookings);
router.put("/status/:id", AuthMiddleware, bookingController.updateBookingStatus);

router.get("/details/:id", AuthMiddleware, bookingController.getBookingDetails);
router.put("/update/:id", AuthMiddleware, bookingController.updateBooking);

router.get("/book", bookingController.getAllBooking)
router.get("/book/:id", bookingController.getBookingById)

router.put("/cancel/:id", AuthMiddleware, bookingController.cancelBooking);
module.exports = router