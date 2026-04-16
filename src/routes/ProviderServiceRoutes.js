const router = require("express").Router()
const AuthMiddleware = require("../Middleware/AuthMiddleware")

const providerServiceController = require("../controllers/ProviderServiceController")

router.post("/add", AuthMiddleware,providerServiceController.addProviderService)
router.get("/my",AuthMiddleware,providerServiceController.getMyServices)
router.put("/update/:id",AuthMiddleware, providerServiceController.updateServiceProvider)
router.delete("/delete/:id",AuthMiddleware, providerServiceController.deleteServiceProvider)
router.get("/service/:serviceId",AuthMiddleware,providerServiceController.getProvidersByService);





module.exports = router