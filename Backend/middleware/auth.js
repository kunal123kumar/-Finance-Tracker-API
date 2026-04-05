import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        if (user.isactive === false) {
            return res.status(401).json({ message: 'User is not active, authorization denied' });
        }
        req.user = user;
        next();
      
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
   
        
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user info found",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};
