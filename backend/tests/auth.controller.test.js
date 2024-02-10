const { register, login } = require('../controllers/auth.controller');
const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');

jest.mock('../models/user.model');
jest.mock('../utils/hashPassword');
jest.mock('../utils/generateToken');

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register function', () => {
    it('should return a 400 response if required fields are not provided', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please fill in all fields',
        success: false,
      });
    });

    it('should return a 400 response if password is less than 6 characters', async () => {
      const req = {
        body: { username: 'test', email: 'test@example.com', password: 'pass' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password must be at least 6 characters long',
        success: false,
      });
    });

    it('should return a 400 response if username is less than 3 characters', async () => {
      const req = {
        body: {
          username: 'us',
          email: 'test@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username must be at least 3 characters long',
        success: false,
      });
    });

    it('should return a 400 response if user with the same username or email already exists', async () => {
      const req = {
        body: {
          username: 'existingUser',
          email: 'existing@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce(true);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists',
        success: false,
      });
    });

    it('should create a new user and return a 201 response for valid registration', async () => {
      const req = {
        body: {
          username: 'newUser',
          email: 'new@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce(false);
      User.create.mockResolvedValueOnce({
        _id: 'newUserId',
        username: 'newUser',
        email: 'new@example.com',
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'newUserId',
        username: 'newUser',
        email: 'new@example.com',
        success: true,
      });
    });

    it('should return a 400 response for any unexpected error during registration', async () => {
      const req = {
        body: {
          username: 'test',
          email: 'test@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockRejectedValueOnce(new Error('Unexpected error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unexpected error',
        success: false,
      });
    });
  });

  describe('login function', () => {
    it('should return a 400 response if required fields are not provided', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please fill in all fields',
        success: false,
      });
    });

    it('should return a 400 response if user does not exist', async () => {
      const req = { body: { user: 'nonexistentUser', password: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User does not exist',
        success: false,
      });
    });

    it('should return a 400 response if password is invalid', async () => {
      const req = {
        body: { user: 'existingUser', password: 'invalidPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce({
        username: 'existingUser',
        password: 'hashedPassword',
      });
      comparePassword.mockResolvedValueOnce(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
        success: false,
      });
    });

    it('should generate a token and return a 200 response for a valid login', async () => {
      const req = { body: { user: 'existingUser', password: 'validPassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce({
        _id: 'existingUserId',
        username: 'existingUser',
        email: 'existing@example.com',
        password: 'hashedPassword',
      });
      comparePassword.mockResolvedValueOnce(true);

      await login(req, res);

      expect(generateToken).toHaveBeenCalledWith(res, 'existingUserId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'existingUserId',
        username: 'existingUser',
        email: 'existing@example.com',
        success: true,
      });
    });

    it('should return a 400 response for any unexpected error during login', async () => {
      const req = { body: { user: 'existingUser', password: 'validPassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockRejectedValueOnce(new Error('Unexpected error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unexpected error',
        success: false,
      });
    });
  });
});
