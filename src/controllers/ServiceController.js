const serviceSchema = require("../models/ServiceModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")


const addServiceByAdmin = async (req, res) => {
    try {
        console.log("BODY 👉", req.body);
        console.log("FILE 👉", req.file);

        const serviceName = req.body?.serviceName;
        const description = req.body?.description;

        // ✅ Better validation
        if (!serviceName || !description || !req.file) {
            return res.status(400).json({
                message: "All fields required",
                debug: {
                    serviceName,
                    description,
                    file: req.file
                }
            });
        }

        const cloudinaryResponse = await uploadToCloudinary(req.file.path);

        const savedService = await serviceSchema.create({
            serviceName,
            description,
            image: cloudinaryResponse.secure_url
        });

        res.status(201).json({
            message: "Service added successfully",
            data: savedService
        });

    } catch (err) {
        res.status(500).json({
            message: "Error while adding service",
            error: err.message
        });
    }
};

const addService = async (req, res) => {
    try {
        const { serviceName, description, price } = req.body;

        // Validation
        if (!serviceName || !description || !price) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // ✅ providerId from token (middleware)
        const newService = await serviceSchema.create({
            serviceName,
            description,
            price,
            providerId: req.user._id
        });

        res.status(201).json({
            message: "Service created successfully",
            data: newService,
        });

    } catch (err) {
        res.status(500).json({
            message: "Error while creating service",
            error: err.message,
        });
    }
};
const updateService = async (req, res) => {

    const updatedObj = await serviceSchema.findByIdAndUpdate(req.params.id, req.body, { new: true },)

    try {
        res.status(200).json({
            message: "data updated..",
            data: updatedObj,
        })
    }
    catch (err) {
        res.status(500).json({
            message: "data not updated",
            err: err
        })
    }
};

const deleteService = async (req, res) => {

    const deletedServiceObj = await serviceSchema.findByIdAndDelete(req.params.id)

    try {
        if (deletedServiceObj) {
            res.status(200).json({
                message: "Service deleted",
                data: deletedServiceObj,
            })
        }
        else {
            res.status(200).json({
                message: "Service not found to delete",
            })
        }
    }

    catch (err) {
        res.status(500).json({
            message: "data not deleted",
            err: err
        })
    }

};



const getAllService = async (req, res) => {

    try {
        const allService = await serviceSchema.find()

        res.status(200).json({
            message: "Service fetched successfully",
            data: allService
        })
    }

    catch (err) {
        res.status(500).json({
            message: "error while fetching service",
            err: err
        })
    }

};

const getServiceByProvider = async (req, res) => {
    try {
        const { providerId } = req.params;

        if (!providerId) {
            return res.status(400).json({
                message: "Provider ID is required"
            });
        }

        const services = await Service.find({ providerId });

        res.status(200).json({
            message: "Services fetched successfully",
            data: services,
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching services",
            error: err.message,
        });
    }
};

const getServiceById = async (req, res) => {

    //const foundService = await serviceSchema.find({_id:req.params.id}) //[]
    const foundService = await serviceSchema.findById(req.params.id); //{}

    try {
        if (foundService) {
            res.status(200).json({
                message: "Service found",
                data: foundService
            })
        }
        else {
            res.status(404).json({
                message: "Service not found",
            })
        }
    }

    catch (err) {

        res.status(500).json({
            message: "error while creating product",
            err: err
        })
    }

};








module.exports = {
    addServiceByAdmin,
    addService,

    getAllService,
    getServiceByProvider,
    getServiceById,
    updateService,
    deleteService
}