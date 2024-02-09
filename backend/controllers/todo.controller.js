const mongoose = require('mongoose');
const Todo = require('../models/todo.model');

// Create and Save a new Todo
const createTodo = async (req, res) => {
  const { title, description, status } = req.body;

  if (!req.user) {
    return res.status(403).json({ message: 'Unauthorized', success: false });
  }

  // Validate request
  if (!req.body.title || !req.body.description || !req.body.status) {
    return res
      .status(400)
      .json({ message: 'Please fill all fields', success: false });
  }

  try {
    // Create a Todo
    const todo = await Todo.create({
      title,
      description,
      status,
      userId: req.user?._id,
    });

    if (!todo) {
      return res
        .status(500)
        .json({ message: 'Something went wrong', success: false });
    }

    res.status(201).json({ todo, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Retrieve and return all todos from the database.
const getAllTodos = async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: 'Unauthorized', success: false });
  }

  try {
    const todos = await Todo.find({ userId: req.user?._id }).sort({
      createdAt: -1,
    });

    if (!todos) {
      return res
        .status(404)
        .json({ message: 'No todos found', success: false });
    }

    res.status(200).json({ todos, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Find a single todo with an id
const getTodo = async (req, res) => {
  const todoId = req.params?.id;

  if (!req.user) {
    return res.status(403).json({ message: 'Unauthorized', success: false });
  }

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return res.status(404).json({ message: 'Invalid todo id', success: false });
  }

  try {
    const todo = await Todo.findOne({
      _id: todoId,
      user: req.user?._id,
    });

    if (!todo) {
      return res
        .status(404)
        .json({ message: 'Todo not found', success: false });
    }

    res.status(200).json({ todo, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update a todo identified by the id in the request
const updateTodo = async (req, res) => {
  const { status } = req.body;
  const todoId = req.params?.id;

  if (!req.user) {
    return res.status(403).json({ message: 'Unauthorized', success: false });
  }

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return res.status(404).json({ message: 'Invalid todo id', success: false });
  }

  if (!status) {
    return res
      .status(400)
      .json({ message: 'Please change status', success: false });
  }

  try {
    const existingTodo = await Todo.findById({
      _id: todoId,
      user: req.user?._id,
    });

    if (!existingTodo) {
      return res
        .status(404)
        .json({ message: 'Todo not found', success: false });
    }

    existingTodo.status = status;
    const updatedTodo = await existingTodo.save();
    if (!updatedTodo) {
      return res
        .status(404)
        .json({ message: 'Todo update failed', success: false });
    }

    res.status(200).json({ todo: updatedTodo, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Delete a todo with the specified id in the request
const deleteTodo = async (req, res) => {
  const todoId = req.params?.id;

  if (!req.user) {
    return res.status(403).json({ message: 'Unauthorized', success: false });
  }

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return res.status(404).json({ message: 'Invalid todo id', success: false });
  }

  try {
    const todo = await Todo.findByIdAndDelete({
      _id: todoId,
      user: req.user?._id,
    });

    if (!todo) {
      return res
        .status(404)
        .json({ message: 'Todo not found', success: false });
    }

    res.status(200).json({
      todoId: todo._id,
      message: 'Todo deleted successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  deleteTodo,
};
