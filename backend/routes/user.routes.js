const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth.controller');
const protect = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);

module.exports = router;
