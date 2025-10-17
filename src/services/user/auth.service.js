import Otp from "../../models/user/Otp.model.js";
import User from "../../models/user/User.model.js";
import jwt from 'jsonwebtoken'
import twilio from 'twilio'


export const sendOtp = async (e164Number) => {
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client=twilio(accountSid,authToken )

    const otp = Math.floor(1000 + Math.random() * 9000)

    await Otp.findOneAndUpdate(
        { phoneNumber: e164Number },
        { otp, expiresAt: new Date() },
        { upsert: true, returnDocument: "after" }
    )


    return otp
}

export const verifyOtp = async (e164Number, otp) => {
   
    
    const otpDoc = await Otp.findOne({ phoneNumber: e164Number })

  

    if (!otpDoc) throw new Error("OTP expired or not found");

    const baseOtp=otpDoc.otp


    if (baseOtp !== otp.toString()) {
        throw new Error("Invalid OTP");
    }

    let user = await User.findOne({ phoneNumber: e164Number }).select('-__v -createdAt -updatedAt');

    if (!user) {
        user = await User.create({ phoneNumber: e164Number, isVerified: true });
    } else if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
    }


    await Otp.deleteOne({ phoneNumber: e164Number });

    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET, { expiresIn: '1d' })


    return { user, token }
}