const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

const {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo.controller');

router.route('/').get(protect, getAllTodos).post(protect, createTodo);
router
  .route('/:id')
  .get(protect, getTodo)
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

module.exports = router;
