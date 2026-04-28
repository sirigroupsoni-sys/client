const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      console.log('Auth failed: No token provided');
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    console.log('User found from token:', user ? user.email : 'null');

    if (!user) {
      return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists' });
    }

    // Grant access
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
