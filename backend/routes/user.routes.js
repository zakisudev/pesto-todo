const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth.controller');
const protect = require('../middlewares/auth.middleware');

// Register a new user
router.post('/register', register);
// Login a user
router.post('/login', login);
// Logout a user
router.get('/logout', protect, logout);

module.exports = router;
