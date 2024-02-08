const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');

// register user
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please fill in all fields', success: false });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long',
      success: false,
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      message: 'Username must be at least 3 characters long',
      success: false,
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists', success: false });
    }

    const user = await User.create({
      username,
      email,
      password: await hashPassword(password),
    });

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// login user
const login = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: 'Please fill in all fields', success: false });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username: user }, { email: user }],
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: 'User does not exist', success: false });
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: 'Invalid credentials', success: false });
    }

    generateToken(res, existingUser._id);

    res.status(200).json({
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// logout user
const logout = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ message: 'User not logged in', success: false });
    }

    return res
      .status(200)
      .cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({ message: 'Logout successful', success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

module.exports = { register, login, logout };
