import User from "../../models/user/User.model.js";


export const addUser = async (userId,userData)=>{

    const existingUser= await User.findById(userId)
    if(!existingUser) throw new Error("user doesend exit")

        const user= await User.findByIdAndUpdate(userId,
            {$set:userData},
            {new:true}).select('-__v -createdAt -updatedAt')
        return user



}