const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otpgenerated: {
        type: Number,
        required: true 
    },
    // Store pending user registration data
    pendingUserData: {
        fullname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'client'
        }
    },
    // OTP expiry time (10 minutes)
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 600 // 10 minutes in seconds
    }
}, {timestamps: true})

const otpModel = mongoose.model("OTP", otpSchema)

module.exports = otpModel;