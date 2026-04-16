const router = require("express").Router()
const upload = require("../Middleware/UploadMiddleware")
const serviceController = require("../controllers/ServiceController")


router.post("/create", upload.single("image"), serviceController.addServiceByAdmin)
router.get("/allService", serviceController.getAllService)
router.put("/update/:id", serviceController.updateService)
router.delete("/delete/:id", serviceController.deleteService)











router.get("/provider/:providerId", serviceController.getServiceByProvider)
router.get("/service/:id", serviceController.getServiceById)


module.exports = router