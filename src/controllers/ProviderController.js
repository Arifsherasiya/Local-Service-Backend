const providerSchema = require("../models/ProviderModel");
const UserSchema = require("../models/UserModel");

// ✅ ADD OR UPDATE PROFILE
// ==============================
const addOrUpdateProfile = async (req, res) => {
    try {
        const { experience, phone } = req.body;
        const providerId = req.user._id;

        console.log("BODY 👉", req.body);
        console.log("FILES 👉", req.files);

        if (!experience) {
            return res.status(400).json({ message: "Experience is required" });
        }

        // ✅ FILE HANDLING
        const profilePic = req.files?.profilePic
            ? req.files.profilePic[0].path.replace(/\\/g, "/")
            : undefined;

        const aadharCard = req.files?.aadharCard
            ? req.files.aadharCard[0].path.replace(/\\/g, "/")
            : undefined;

        // ==============================
        // ✅ UPDATE USER DATA
        // ==============================
        const user = await UserSchema.findById(providerId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (phone) user.phone = phone;

        await user.save();

        // ==============================
        // ✅ CHECK PROVIDER PROFILE
        // ==============================
        let profile = await providerSchema.findOne({ providerId });

        if (profile) {
            if (profilePic) profile.profilePic = profilePic;
            if (aadharCard) profile.aadharCard = aadharCard;

            profile.experience = experience;

            await profile.save();

        } else {
            profile = await providerSchema.create({
                providerId,
                profilePic,
                aadharCard,
                experience
            });
        }

        res.status(200).json({
            message: "Profile saved successfully ✅",
            data: profile
        });

    } catch (err) {
        console.error("🔥 ERROR:", err);
        res.status(500).json({
            message: "Failed to save profile",
            error: err.message
        });
    }
};

// ==============================
// GET PROFILE
// ==============================
const getProviderProfile = async (req, res) => {
    try {
        const providerId = req.user._id;

        const profile = await providerSchema.findOne({ providerId })
            .populate("providerId", "firstName lastName email phone");

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched",
            data: profile
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching profile",
            error: err.message
        });
    }
};
const getAllProviders = async (req, res) => {
    try {

        // ✅ STEP 1: GET ALL USERS WITH ROLE PROVIDER
        const users = await UserSchema.find({ role: "provider" });

        // ✅ STEP 2: GET ALL PROVIDER PROFILES
        const profiles = await providerSchema.find();

        // ✅ STEP 3: MERGE DATA
        const result = users.map((user) => {

            // find matching profile
            const profile = profiles.find(
                (p) => p.providerId.toString() === user._id.toString()
            );

            return {
                _id: user._id,

                // ✅ USER DATA
                providerId: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                },

                // ✅ PROFILE DATA (IF EXISTS)
                profilePic: profile?.profilePic || "",
                experience: profile?.experience || "0",
                aadharCard: profile?.aadharCard || "",
                verified: profile?.verified || false
            };
        });

        res.status(200).json({
            message: "All providers (with or without profile)",
            data: result
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error fetching providers",
            error: err.message
        });
    }
};

const deleteProvider = async (req, res) => {
    try {
        const { id } = req.params; // this is USER ID

        // ✅ 1. DELETE PROVIDER PROFILE
        await providerSchema.findOneAndDelete({ providerId: id });

        // ✅ 2. DELETE USER
        const deletedUser = await UserSchema.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "Provider not found"
            });
        }

        res.status(200).json({
            message: "Provider deleted successfully ✅"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error deleting provider",
            error: err.message
        });
    }
};




module.exports = {
    addOrUpdateProfile,
    getProviderProfile,
    getAllProviders,
    deleteProvider
};