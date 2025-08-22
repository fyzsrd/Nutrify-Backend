
import * as profileService from '../../services/user/address.service.js'

export const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            firstName,
            lastName,
            mobileNumber,
            pincode,
            city,
            state,
            addressLine,
            landmark,
            addressType,
            defaultAddress,
        } = req.body;

        // validate required fields (exclude defaultAddress)
        if (
            !firstName ||
            !lastName ||
            !mobileNumber ||
            !pincode ||
            !city ||
            !state ||
            !addressLine ||
            !landmark ||
            !addressType
        ) {
            return res
                .status(400)
                .json({ success: false, message: "All fields required" });
        }

        const addressData = {
            firstName,
            lastName,
            mobileNumber,
            pincode,
            city,
            state,
            addressLine,
            landmark,
            addressType,
            defaultAddress, // can be true/false
        };

        const newAddress = await profileService.addAddress(userId, addressData);

        res.status(201).json({ success: true, address: newAddress });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

//get all address
export const getAllAddress = async (req, res) => {

    try {

        const userId = req.user.id;

        const allAddress = await profileService.allAddress(userId)
        res.status(200).json({ success: true, address: allAddress });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}



export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const addressData = req.body;
        

        const updatedAddress = await profileService.updateAddress(
            userId,
            addressId,
            addressData
        );

        res.status(200).json({ success: true, address: updatedAddress });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id
        const addressId = req.params.id

        const deletedAddress = await profileService.deleteAddress(userId, addressId)
        res.status(200).json({
            success: true,
            message: "Deleted successfully",
            address: deletedAddress,
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}















//defualt addres for chegout
// export const getAddressForCheckout = async (userId) => {
//   const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

//   if (!addresses.length) {
//     return {
//       defaultAddress: null,
//       otherAddresses: []
//     };
//   }

// find default
//   const defaultAddress = addresses.find(addr => addr.default) || addresses[0];

// all non-defaults
//   const otherAddresses = addresses.filter(addr => !addr._id.equals(defaultAddress._id));

//   return {
//     defaultAddress,
//     otherAddresses
//   };
// };