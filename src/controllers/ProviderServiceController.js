const providerServiceSchema = require("../models/ProviderService Model")
const mongoose = require("mongoose");

const addProviderService = async (req, res) => {
    try {
        console.log("USER 👉", req.user);


        const newService = await providerServiceSchema.create({
            providerId: req.user._id,
            serviceId: req.body.serviceId,
            description: req.body.description,
            price: req.body.price
        });

        res.status(201).json({
            message: "Service added successfully",
            data: newService
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getMyServices = async (req, res) => {
    try {
        const services = await providerServiceSchema
            .find({ providerId: req.user._id })
            .populate("serviceId") // Populates serviceName, image, description
            .lean();

        // Format the data to include both descriptions
        const formatted = services.map((s) => ({
            _id: s._id,
            serviceName: s.serviceId.serviceName,
            image: s.serviceId.image,
            providerDescription: s.description,           // Provider-specific description
            originalDescription: s.serviceId.description, // Original service description
            price: s.price
        }));

        res.status(200).json({
            message: "My services",
            data: formatted
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching services",
            error: err.message
        });
    }
};

const updateServiceProvider = async (req, res) => {
    try {
        const { id } = req.params;

        // Only allow provider to update their own service
        const updatedObj = await providerServiceSchema.findOneAndUpdate(
            { _id: id, providerId: req.user._id },
            req.body,
            { new: true }
        );

        if (updatedObj) {
            res.status(200).json({
                message: "Service updated successfully",
                data: updatedObj,
            });
        } else {
            res.status(404).json({
                message: "Service not found or you are not authorized",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to update service",
            error: err.message,
        });
    }
};

const deleteServiceProvider = async (req, res) => {
    try {
        const { id } = req.params;

        // Only allow provider to delete their own service
        const deletedObj = await providerServiceSchema.findOneAndDelete({
            _id: id,
            providerId: req.user._id,
        });

        if (deletedObj) {
            res.status(200).json({
                message: "Service deleted successfully",
                data: deletedObj,
            });
        } else {
            res.status(404).json({
                message: "Service not found or you are not authorized",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete service",
            error: err.message,
        });
    }
};

const getProvidersByService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        console.log("SERVICE ID 👉", serviceId);

        // ✅ Check valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({
                message: "Invalid service ID"
            });
        }

        const providers = await providerServiceSchema
            .find({ serviceId: serviceId })
            .populate("providerId", "firstName lastName profilePic") // ✅ SAFE
            .populate("serviceId", "serviceName")
            .lean();

        console.log("PROVIDERS 👉", providers);

        res.status(200).json({
            message: "Providers fetched",
            data: providers || []
        });

    } catch (err) {
        console.error("❌ BACKEND ERROR:", err);

        res.status(500).json({
            message: "Error fetching providers",
            error: err.message
        });
    }
};

module.exports = {
    addProviderService,
    getMyServices,
    updateServiceProvider,
    deleteServiceProvider,
    getProvidersByService
}