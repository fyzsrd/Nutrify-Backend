import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { 
        type: String, required: true
     },
    lastName: {
         type: String, required: true 
        },
    mobileNumber: {
         type: String, required: true
         }, // delivery contact
    email: { 
        type: String 
    }, // optional (for notifications)
    altPhoneNo: {
         type: String 
        },

    pincode: { 
        type: String, required: true 
    },
    city: {
         type: String, required: true 
        },
    state: {
         type: String, required: true
         },
    addressLine: {
         type: String, required: true
         },
    landmark: {
         type: String 
        },

    addressType: {
      type: String,
      enum: ["Home", "Work", "Gym", "Others"],
      default: "Home",
    },
    defaultAddress: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const Address=mongoose.model('Address',addressSchema)
export default Address;