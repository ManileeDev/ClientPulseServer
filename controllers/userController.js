const UserModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const validator = require("validator");
const userModel = require("../models/userModel");
const nodemailer = require('nodemailer');

const jwt = require("jsonwebtoken")

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const createUser = async (req, res) => {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields must be filled" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Email is Invalid' })
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ success: false, message: 'Password is not Strong' })
    }
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already Registered" })
        }

        // Instead of creating user directly, initiate OTP verification
        const otpGenerator = require("otp-generator");
        const otpModel = require("../models/OTP");
        const { getOTPEmailTemplate } = require("../templates/emailTemplates");
        const nodemailer = require('nodemailer');

        const otpgenerated = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Hash password for storage
        const hashpassword = await bcrypt.hash(password, 10);

        // Store OTP with pending user data
        const existingOtp = await otpModel.findOne({ email });
        if (!existingOtp) {
            await otpModel.create({
                email,
                otpgenerated,
                pendingUserData: {
                    fullname,
                    password: hashpassword,
                    role: role || 'client'
                }
            });
        } else {
            await otpModel.findOneAndUpdate({ email }, {
                otpgenerated,
                pendingUserData: {
                    fullname,
                    password: hashpassword,
                    role: role || 'client'
                },
                expiresAt: new Date()
            });
        }

        // Send OTP email
        const emailTemplate = getOTPEmailTemplate(otpgenerated, email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.mail,
                pass: process.env.pass
            }
        });

        const mailOptions = {
            from: 'donotreplyleemailer@gmail.com',
            to: email,
            subject: 'Verify Your Email - OTP for Account Registration',
            html: emailTemplate.html,
            text: emailTemplate.text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete registration.",
            otpSent: true,
            email: email
        });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields must be filled" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid Email" })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "No User found with this mail!" })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(404).json({ success: false, message: "Password did not match" })
        }

        // Return consistent user data format
        const userData = {
            _id: user._id,
            name: user.fullname,
            email: user.email,
            role: user.role
        }

        let token = createToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            user: userData,
            token: token
        })
    }
    catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        const result = users.map(user => {
            return {
                fullname: user.fullname,
                email: user.email,
                // phone : user.phone,
                userId: user._id
            }
        })
        res.status(200).json(result)

    }
    catch (e) {
        res.status(400).json({ err: e.message })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (user.role == "admin") {
            return res.status(400).json({ message: "Admin can not be deleted" })
        }
        await userModel.findByIdAndDelete(id)
        res.status(200).json({ message: "User Deleted Successfully", user })
    }
    catch (e) {
        res.status(400).json({ err: e.message })
    }
}

// const forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     try {
//       const user = await UserModel.findOne({ email });
//       if (!user) {
//         return res.status(404).json({ message: "No user Found" });
//       }
//       const token = jwt.sign(user.email, process.env.SECRET)
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.mail,
//             pass: process.env.pass
//         },
//       });

//       const mailOptions = {
//         from: 'donotreplyleemailer@gmail.com',
//         to: email,
//         subject: `Password Reset link for ${user.fullname}`,
//         text: `https://leecart.netlify.app/resetpassword/${token}`,
//       };

//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email sent: " + info.response);
//         }
//       });
//       res
//         .status(200)
//         .json({status : "success",message: "Email has been sent to the registered mail" });
//     } catch (err) {
//       res.json({message: err.message});
//     }
//   };

//   const resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;
//     try {
//       const  email = jwt.verify(token,process.env.SECRET);
//       const user = await UserModel.findOne({ email });
//       const match = await bcrypt.compare(password, user.password);
//       const hash = await bcrypt.hash(password, 10);

//       if (match) {
//         return res.status(400).json({ message: "Password Already Exist" });
//       }

//       await UserModel.findOneAndUpdate({ email }, { password: hash });
//       res.status(200).json({message: "password reset successfully",fullname : user.fullname});
//     } catch (err) {
//       res.json({err : err.message});
//     }
//   };

module.exports = { createUser, loginUser, getAllUsers, deleteUser }


