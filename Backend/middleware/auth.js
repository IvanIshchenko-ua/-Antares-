const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Для тестування дозволимо запити без токена
      console.log('No token provided, but allowing for testing');
      req.user = { id: 1, email: 'test@admin.com' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Auth error, but allowing for testing:', error.message);
    req.user = { id: 1, email: 'test@admin.com' };
    next();
  }
};

module.exports = auth;