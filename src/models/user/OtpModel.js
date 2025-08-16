import mongoose from "mongoose";
const { Schema } = mongoose;

const otpSchema= new Schema({
    mobileNumber:{
        type : String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        default:Date.now,
        index:{
            expires:300
        }
    }

})

const Otp = mongoose.model("Otp",otpSchema)
export default Otp