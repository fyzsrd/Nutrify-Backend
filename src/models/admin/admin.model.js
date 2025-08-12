import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Normalize email
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password changed
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
