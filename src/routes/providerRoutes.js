const router = require("express").Router()
const AuthMiddleware = require("../Middleware/AuthMiddleware");
const upload = require("../Middleware/UploadMiddleware")
const providerController = require("../controllers/ProviderController")

router.post("/profile", AuthMiddleware,
    upload.fields([{ name: "profilePic", maxCount: 1 }, { name: "aadharCard", maxCount: 1 }]),
    providerController.addOrUpdateProfile);
router.get("/profile", AuthMiddleware, providerController.getProviderProfile);
router.get("/allProvider", providerController.getAllProviders)
router.delete("/delete/:id", providerController.deleteProvider);



module.exports = router