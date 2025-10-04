import User from "../../models/user/User.model.js";

export const getAllUsers=async ()=>{

    const users=await User.find({}).select('phoneNumber isBlocked isVerified firstName _id')
    return users
    
}


export const getUserById=async (userID)=>{
    
}