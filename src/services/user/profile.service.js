import Address from "../../models/user/address.model.js";



export const addAddress = async (userId, addressData) => {
    const existingAddresses = await Address.find({ userId });
    if (!existingAddresses) throw new Error("User not found");

    // If first address → make it default
    if (existingAddresses.length === 0) {
        addressData.defaultAddress = true;
    }

    // If this is default → unset all others
    if (addressData.defaultAddress) {
        await Address.updateMany(
            { userId, defaultAddress: true },
            { $set: { defaultAddress: false } }
        );
    }

    // Save new address
    const newAddress = await Address.create({
        userId,
        ...addressData,
    })

    return newAddress;
};



export const allAddress = async (userId) => {
    const address = await Address.find({ userId })
        .select('-__v -userId  -createdAt -updatedAt')
        .sort({ defaultAddress: -1 })
    return address
}

export const updateAddress = async (userId, addressId, addressData) => {

    const existingAddress = await Address.findOne({ _id:addressId , userId })
    if (!existingAddress) {
        throw new Error("Address not found for this user");
    }
    
    if(addressData.defaultAddress){
        await Address.updateMany(
            {userId,defaultAddress:true},
            {$set:{defaultAddress:false}}
        )
    }


    const updatedAddress  = await Address.findByIdAndUpdate(
         addressId,
         {$set: addressData }, 
         { new: true }).select("-__v -userId -createdAt -updatedAt");

    return updatedAddress
}

export const deleteAddress = async (userId,addressId)=>{

    const existingAddress = await Address.findOne({ _id:addressId , userId })
    if (!existingAddress) {
        throw new Error("Address not found for this user");
    }

    const deletedAddress=await Address.findByIdAndDelete(addressId)
    return deletedAddress;
}