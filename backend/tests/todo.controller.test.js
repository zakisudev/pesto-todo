const mongoose = require('mongoose');
const {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo.controller');
const Todo = require('../models/todo.model');

jest.mock('../models/todo.model');

describe('Todo Controller Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('createTodo function', () => {
    it('should return a 403 response if user is not authenticated', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
        success: false,
      });
    });

    it('should return a 400 response if required fields are not provided', async () => {
      const req = { user: { _id: 'userId' }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please fill all fields',
        success: false,
      });
    });

    it('should create a new todo and return a 201 response for valid input', async () => {
      const req = {
        user: { _id: 'userId' },
        body: {
          title: 'New Todo',
          description: 'Todo description',
          status: 'pending',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Todo.create.mockResolvedValueOnce({
        _id: 'newTodoId',
        title: 'New Todo',
        description: 'Todo description',
        status: 'pending',
        userId: 'userId',
      });

      await createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        todo: {
          _id: 'newTodoId',
          title: 'New Todo',
          description: 'Todo description',
          status: 'pending',
          userId: 'userId',
        },
        success: true,
      });
    });

    it('should return a 500 response for any unexpected error during todo creation', async () => {
      const req = {
        user: { _id: 'userId' },
        body: {
          title: 'New Todo',
          description: 'Todo description',
          status: 'pending',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Todo.create.mockRejectedValueOnce(new Error('Unexpected error'));

      await createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unexpected error',
        success: false,
      });
    });
  });

  describe('getAllTodos', () => {
    it('should return all todos for a valid user', async () => {
      const req = { user: { _id: 'validUserId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const todos = [{ title: 'Todo 1' }, { title: 'Todo 2' }];

      Todo.find = jest.fn().mockReturnValue({
        sort: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(todos) }),
      });

      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ todos, success: true });
    });

    it('should return an empty array if user has no todos', async () => {
      const req = { user: { _id: 'validUserId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Todo.find = jest.fn().mockReturnValue({
        sort: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
      });

      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No todos found',
        success: false,
      });
    });

    it('should return todos sorted by createdAt in descending order', async () => {
      const req = { user: { _id: 'validUserId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const todos = [
        { title: 'Todo 1', createdAt: new Date(2022, 1, 1) },
        { title: 'Todo 2', createdAt: new Date(2022, 1, 2) },
      ];

      Todo.find = jest.fn().mockReturnValue({
        sort: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(todos) }),
      });

      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ todos, success: true });
    });

    it('should return an error message with status code 404 if no todos found', async () => {
      const req = { user: { _id: 'validUserId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Todo.find = jest.fn().mockReturnValue({
        sort: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No todos found',
        success: false,
      });
    });

    it('should return an error message with status code 403 if user is unauthorized', async () => {
      const req = { user: null };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
        success: false,
      });
    });

    it('should return an error message with status code 500 for server errors', async () => {
      const req = { user: { _id: 'validUserId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Todo.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Server error')),
        }),
      });

      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        success: false,
      });
    });
  });

  describe('getTodo', () => {
    it('should return a 200 response with the requested todo', async () => {
      const req = {
        user: { _id: 'validUserId' },
        params: { id: 'validTodoId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTodo = {
        _id: 'validTodoId',
        userId: 'validUserId',
        title: 'Test Todo',
        description: 'Test description',
        status: 'pending',
      };

      Todo.findOne.mockResolvedValueOnce(mockTodo);

      await getTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mockTodo, success: true });
    });

    // Returns a 404 error message with invalid todo id
    it('should return a 404 error message with invalid todo id', async () => {
      const req = {
        params: { id: 'invalidId' },
        user: { _id: 'validUserId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

      await getTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid todo id',
        success: false,
      });
    });

    it('should return a 403 error message with a valid id and unauthenticated user', async () => {
      const req = {
        params: { id: 'validId' },
        user: null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
        success: false,
      });
    });

    it('should return a 500 error message when an error occurs while finding the todo', async () => {
      const req = {
        params: { id: 'validId' },
        user: { _id: 'validUserId' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Todo.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      await getTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error',
        success: false,
      });
    });

    it('should return a 403 error message when there is no authenticated user', async () => {
      const req = {
        params: { id: 'validId' },
        user: null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('updateTodo function', () => {
    it('should return a 403 response if user is not authenticated', async () => {
      const req = { params: { id: 'todoId' }, body: { status: 'completed' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
        success: false,
      });
    });

    it('should return a 404 response for an invalid todo id', async () => {
      const req = {
        user: { _id: 'userId' },
        params: { id: 'invalidId' },
        body: { status: 'completed' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);

      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid todo id',
        success: false,
      });
    });

    it('should return a 400 response if status is not provided', async () => {
      const req = {
        user: { _id: 'userId' },
        params: { id: 'todoId' },
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);

      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please change status',
        success: false,
      });
    });

    it('should return a 404 response if todo is not found', async () => {
      const req = {
        user: { _id: 'userId' },
        params: { id: 'todoId' },
        body: { status: 'completed' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Todo.findById.mockResolvedValueOnce(null);

      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Todo not found',
        success: false,
      });
    });

    it('should update the todo and return a 200 response for a valid request', async () => {
      const req = {
        user: { _id: 'userId' },
        params: { id: 'todoId' },
        body: { status: 'completed' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Todo.findById.mockResolvedValueOnce({
        _id: 'todoId',
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
        userId: 'userId',
        save: jest.fn().mockResolvedValueOnce({
          _id: 'todoId',
          title: 'Test Todo',
          description: 'Test Description',
          status: 'completed',
          userId: 'userId',
        }),
      });

      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        todo: {
          _id: 'todoId',
          title: 'Test Todo',
          description: 'Test Description',
          status: 'completed',
          userId: 'userId',
        },
        success: true,
      });
    });

    it('should return a 500 response for any unexpected error during updating a todo', async () => {
      const req = {
        user: { _id: 'userId' },
        params: { id: 'todoId' },
        body: { status: 'completed' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Todo.findById.mockRejectedValueOnce(new Error('Unexpected error'));

      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unexpected error',
        success: false,
      });
    });
  });

  describe('deleteTodo function', () => {
    it('should return a 403 response if user is not authenticated', async () => {
      const req = { params: { id: 'todoId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
        success: false,
      });
    });

    it('should return a 404 response for an invalid todo id', async () => {
      const req = { user: { _id: 'userId' }, params: { id: 'invalidId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);

      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid todo id',
        success: false,
      });
    });

    it('should return a 404 response if todo is not found', async () => {
      const req = { user: { _id: 'userId' }, params: { id: 'todoId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Todo.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Todo not found',
        success: false,
      });
    });

    it('should delete the todo and return a 200 response for a valid request', async () => {
      const req = { user: { _id: 'userId' }, params: { id: 'todoId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Todo.findByIdAndDelete.mockResolvedValueOnce({
        _id: 'todoId',
        title: 'Test Todo',
        description: 'Test Description',
        status: 'completed',
        userId: 'userId',
      });

      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        todoId: 'todoId',
        message: 'Todo deleted successfully',
        success: true,
      });
    });

    it('should return a 500 response for any unexpected error during deleting a todo', async () => {
      const req = { user: { _id: 'userId' }, params: { id: 'todoId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Todo.findByIdAndDelete.mockRejectedValueOnce(
        new Error('Unexpected error')
      );

      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unexpected error',
        success: false,
      });
    });
  });
});
