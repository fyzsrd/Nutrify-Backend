import jwt from 'jsonwebtoken';
import Admin from '../models/admin/admin.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;


    // Check cookie token first
    if (req.cookies?.adminToken) {
      token = req.cookies.adminToken;

    } 
    
    // If no cookie token, check Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'admin not found' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
