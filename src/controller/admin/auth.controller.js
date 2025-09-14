import Admin from '../../models/admin/admin.model.js';

import * as  authService from '../../services/admin/auth.service.js'


export const adminRegister = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin=await authService.register({ name, password, email })
  

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { token, admin } = await authService.login({ email, password });

    res.cookie("adminToken", token, {
      httpOnly: true,
        secure: false,   // disable for localhost
      sameSite: "lax", // allow cross-origin
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin login successful",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    // If error message = "Invalid credentials", return 400
    if (error.message === "Invalid credentials") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
