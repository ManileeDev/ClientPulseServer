const express = require("express")
const {generateOTP,validateOTP} = require("../controllers/otpController")

const router = express.Router()


router.post("/generate-otp",generateOTP)
router.post("/validate-otp",validateOTP)



module.exports = router;