const jwt = require('jsonwebtoken');

exports.refreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};
