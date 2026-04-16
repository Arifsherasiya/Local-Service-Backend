const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailsend = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
const secret = "secret"

const registerUser = async (req, res) => {

    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const savedUser = await userSchema.create({ ...req.body, password: hashedPassword })

        await mailsend(
            savedUser.email,
            "Welcome to Local Service App",
            `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px;">
            
            <h2 style="color:#2563eb; text-align:center;">
                Welcome to Local Service 🚀
            </h2>

            <p>Hi <b>${savedUser.firstName}</b>,</p>

            <p>Your account has been successfully created on <b>Local Service</b>.</p>

            <div style="text-align:center; margin:20px;">
                <a href="http://localhost:5173"
                style="background:#2563eb; color:white; padding:10px 20px;
                text-decoration:none; border-radius:6px;">
                Visit Website
                </a>
            </div>

            <p style="font-size:12px; color:gray; text-align:center;">
                © 2026 Local Service
            </p>

        </div>
    </div>
    `
        );

        res.status(201).json({
            message: "user created successfully",
            data: savedUser
        })

    } catch (err) {
        res.status(500).json({
            message: "error while creating user",
            err: err
        })
    }
};

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body

        const foundUserFromEmail = await userSchema.findOne({ email: email })

        if (foundUserFromEmail) {

            const isPasswordMatched = await bcrypt.compare(password, foundUserFromEmail.password)

            if (isPasswordMatched) {

                const token = jwt.sign({
                    _id: foundUserFromEmail._id,
                    role: foundUserFromEmail.role
                }, "secret");

                res.status(200).json({
                    message: "Login Success",
                    token: token,
                    role: foundUserFromEmail.role,
                    userId: foundUserFromEmail._id
                })
            }
            else {
                res.status(401).json({
                    message: "Invalid Credentials"
                })
            }
        }
        else {
            res.status(404).json({
                message: "user not found."
            })
        }

    } catch (err) {

        res.status(500).json({
            message: "error while logging in",
            err: err
        })
    }
};

const forgotPassword = async (req, res) => {


    const { email } = req.body;
    if (!email) return res.status(400).json({
        messsage: "email is not provided."
    })

    const foundUserFromEmail = await userSchema.findOne({ email: email })
    if (foundUserFromEmail) {
        //token generate..
        const token = jwt.sign(foundUserFromEmail.toObject(), secret, { expiresIn: 60 * 24 * 7 })
        //reset link..
        const url = `http://localhost:5173/resetpassword/${token}`
        //send mail
        const mailtext = `<html>
            <a href ='${url}'>RESET PASSWORD</a>
        </html>`
        await mailsend(foundUserFromEmail.email, "Reset Password Link", mailtext)
        res.status(200).json({
            message: "reset link has been sent to your email"
        })


    }
    else {
        res.status(404).json({
            message: "user not found.."
        })
    }



};

const resetPassword = async (req, res) => {

    const token = req.params.token;
    const { newPassword } = req.body;

    try {

        const decodedUser = jwt.verify(token, secret);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userSchema.findByIdAndUpdate(decodedUser._id, {
            password: hashedPassword
        });

        res.status(200).json({
            message: "password reset successfully !!",
        });

    } catch (err) {
        res.status(400).json({
            message: "Invalid or expired token"
        });
    }
};

const getAllCustomer = async (req, res) => {

    try {

        const allCustomer = await userSchema.find({ role: "customer" });

        res.status(200).json({
            message: "Users fetched successfully",
            totalCustomer: allCustomer.length,
            data: allCustomer
        })

    } catch (err) {

        res.status(500).json({
            message: "Error while fetching Customer",
            err: err
        })

    }

};

const getAllProvider = async (req, res) => {

    try {

        const allProvider = await userSchema.find({ role: "provider" });

        res.status(200).json({
            message: "Users fetched successfully",
            totalProvider: allProvider.length,
            data: allProvider
        })

    } catch (err) {

        res.status(500).json({
            message: "Error while fetching Provider",
            err: err
        })

    }

};

const getUser = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched",
            data: user
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching user",
            err
        });
    }
};

// ✅ UPDATE USER (WITH IMAGE)
const updateUser = async (req, res) => {
    try {
        const updateData = {
            ...req.body
        };

        // 🔥 IMPORTANT PART
        if (req.file) {
            updateData.profilePic = req.file.path;
        }

        const updatedUser = await userSchema.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating user",
            err
        });
    }
};







module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllCustomer,
    getAllProvider,
    getUser,
    updateUser
    

}