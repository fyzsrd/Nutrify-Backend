
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin/admin.model.js';
import dotenv from 'dotenv';


dotenv.config()

export const login = async ({ email, password }) => {

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT
    const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );


    return { token, admin };
}

export const register  = async ({ name, password, email }) => {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: "Admin already registered" });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    return admin
}