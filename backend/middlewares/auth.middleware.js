const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized, no token', success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: 'Unauthorized, invalid token', success: false });
    }

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', success: false });
  }
};

module.exports = protect;
