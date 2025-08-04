const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const requireDeveloper = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    // Extract token (format: "Bearer TOKEN")
    const token = authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    // Verify token
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await userModel.findById(id).select('_id email fullname role');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is developer or admin
    if (user.role !== 'developer' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Developer privileges required.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Developer auth middleware error:', error);
    
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

    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

module.exports = requireDeveloper; 