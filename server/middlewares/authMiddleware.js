const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: 'Access denied. Unauthorized role.' });
      }

      next();
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid token.' });
    }
  };
};

module.exports = auth;
