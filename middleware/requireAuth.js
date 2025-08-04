const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel');

const requireAuth = async (req, res, next) => {
    try {
        // verify user is authenticated
        const { authorization } = req.headers;
      
        if (!authorization) {
            return res.status(401).json({
                success: false, 
                message: 'Authorization token required'
            });
        }
      
        const token = authorization.split(' ')[1];
      
        // Verify token and get user ID
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database with all necessary fields
        const user = await userModel.findById(id).select('_id email fullname role');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Attach user with consistent format to request object
        req.user = {
            _id: user._id,
            name: user.fullname,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        console.log(error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }
        
        res.status(401).json({
            success: false, 
            message: 'Request is not authorized'
        });
    }
};
  
module.exports = requireAuth;