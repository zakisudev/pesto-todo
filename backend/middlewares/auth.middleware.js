const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Middleware function to protect routes by checking for a valid JWT token.
 * If the token is missing or invalid, it returns a 401 Unauthorized response.
 * If the token is valid, it sets the authenticated user in the request object and calls the next middleware.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
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
