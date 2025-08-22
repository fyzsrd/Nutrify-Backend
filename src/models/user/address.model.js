import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // faster lookups per user
    },

    firstName: { 
      type: String, 
      required: [true, "First name is required"], 
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String, 
      required: [true, "Last name is required"], 
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    mobileNumber: {
      type: String, 
      required: [true, "Mobile number is required"],
      trim: true,
      
    },

    email: { 
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    altPhoneNo: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid alternate phone number"],
    },

    pincode: { 
      type: String, 
      required: [true, "Pincode is required"], 
      trim: true,
      match: [/^\d{6}$/, "Invalid pincode"], // adjust if global
    },

    city: {
      type: String, 
      required: true, 
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    state: {
      type: String, 
      required: true, 
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    addressLine: {
      type: String, 
      required: true, 
      trim: true,
      minlength: 5,
      maxlength: 255,
    },

    landmark: {
      type: String,
      trim: true,
      maxlength: 100,
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

// ✅ Pre-save hook: Ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.defaultAddress) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { defaultAddress: false } }
    );
  }
  next();
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
