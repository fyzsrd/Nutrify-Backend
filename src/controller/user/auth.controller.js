import * as authService from '../../services/user/auth.service.js'
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

//userAuth

export const generateOtp = async (req, res) => {
    try {
        const { mobileNumber, countryCode } = req.body;

        if (!mobileNumber || !countryCode) return res.status(400).json({ success: false, message: "Mobile number is required" });


        const validNumber = isValidPhoneNumber(mobileNumber, countryCode)

        if (!validNumber) return res.status(400).json({ success: false, message: "Enter Valid Mobile Number" });


        const phoneObj = parsePhoneNumberFromString(mobileNumber, countryCode)
        if (!phoneObj) {
            return res.status(400).json({ success: false, message: "Invalid number" });
        }

        const e164Number = phoneObj.number;


        const otp = await authService.sendOtp(e164Number)

        res.status(200).json({ success: true, message: "OTP sent successfully", otp });

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message
        })
    }
}

export const verifyotp = async (req, res) => {
    try {
        const { mobileNumber, countryCode, otp } = req.body;

        if (!mobileNumber || !countryCode || !otp) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        
        const validNumber = isValidPhoneNumber(mobileNumber, countryCode);
        if (!validNumber) {
            return res.status(400).json({ success: false, message: "Enter valid mobile number" });
        }

        
        const phoneObj = parsePhoneNumberFromString(mobileNumber, countryCode);
        if (!phoneObj) {
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }
        const e164Number = phoneObj.number;

       
        const result = await authService.verifyOtp(e164Number, otp)

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            user: result.user,
            token: result.token, 
        });


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message
        })
    }
}