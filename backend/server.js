require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const todoRoutes = require('./routes/todo.routes');

// Connect to database
connectDB();
// Create an express application
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

// app.use('/api/todos', require('./routes/productRoutes'));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
