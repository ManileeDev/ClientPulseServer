const otpModel = require("../models/OTP")
const nodemailer = require('nodemailer');
const otpGenerator = require("otp-generator");
const userModel = require("../models/userModel");
const { getOTPEmailTemplate } = require("../templates/emailTemplates");


const generateOTP = async (req,res) => {
    const {email} = req.body;
    const otpgenerated = otpGenerator.generate(4, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
    try{
        const user = await otpModel.findOne({email})
        const userExist = await userModel.findOne({email})
    if(userExist){
        return res.status(400).json({message : "Email already registered!!"})
    }
    if(!user){
        await otpModel.create({email,otpgenerated})
    }
    else{
        await otpModel.findOneAndUpdate({email},{otpgenerated})
    }

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
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.json({message : "OTP has been generated"})
    }
    catch(e){
        res.json({err: e.message})
    }
}


const validateOTP = async (req,res) => {
    const {email, otp} = req.body;
    try{
        const otpRecord = await otpModel.findOne({email});
        
        if(!otpRecord){
            return res.status(404).json({
                success: false, 
                message: "OTP not found. Please request a new one."
            });
        }

        if(otpRecord.otpgenerated == otp){
            // OTP is valid, create the user
            const userModel = require("../models/userModel");
            
            const newUser = await userModel.create({
                fullname: otpRecord.pendingUserData.fullname,
                email: email,
                password: otpRecord.pendingUserData.password,
                role: otpRecord.pendingUserData.role
            });

            // Delete the OTP record after successful verification
            await otpModel.findOneAndDelete({email});

            // Don't return user data - user needs to login separately
            return res.status(201).json({
                success: true,
                message: "Account created successfully! Please log in with your credentials.",
                accountCreated: true,
                email: email
            });
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again."
            });
        }
    }
    catch(e){
        console.error('OTP validation error:', e);
        res.status(500).json({
            success: false, 
            message: "An error occurred during verification.",
            error: e.message
        });
    }
}


module.exports = {generateOTP,validateOTP}


