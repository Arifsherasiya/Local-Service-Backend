const router = require("express").Router()
const upload = require("../Middleware/UploadMiddleware")
const userController = require("../controllers/UserController")


router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/forgotpassword", userController.forgotPassword)
router.put("/resetpassword/:token", userController.resetPassword)
router.get("/customer", userController.getAllCustomer)
router.get("/provider", userController.getAllProvider)
router.get("/profile/:id", userController.getUser);
router.put("/profile/:id", upload.single("profilePic"), userController.updateUser);



module.exports = router