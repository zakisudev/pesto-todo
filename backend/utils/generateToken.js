const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token and sets it as a cookie in the response.
 * @param {Object} res - The response object.
 * @param {string} id - The user ID.
 * @returns {void}
 */
const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
  });
};

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token to be verified.
 * @returns {object} - The decoded token payload.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
