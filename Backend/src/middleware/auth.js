// src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' } 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const secret = process.env.JWT_SECRET || 'globetrotter_super_secret_jwt_key_2026';
    const payload = jwt.verify(token, secret);
    req.user = payload; // Attaches { userId: ... } to the request
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: { code: 'UNAUTHORIZED', message: 'Token expired or invalid' } 
    });
  }
};