
import jwt from 'jsonwebtoken'
import User from '../models/user/User.model.js';


const userAuth = async (req, res, next) => {
    try {
        let token;

        // Check cookie token first
        if (req.cookies?.userToken) {
            token = req.cookies.userToken;

        }

        // If no cookie token, check Authorization header
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        

        if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next()

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export default userAuth