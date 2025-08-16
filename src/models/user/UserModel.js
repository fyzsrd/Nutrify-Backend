import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format (e.g. +919876543210)"]
        },
        firstName: {
            type: String,
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"],
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            unique: true,
            sparse: true, // allows users without email
            lowercase: true,
            trim: true,
            
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["male", "female", "others"],
        },
        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // don’t return password in queries
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true } // adds createdAt & updatedAt
);

// ✅ Hash password before save
import bcrypt from "bcrypt";

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
