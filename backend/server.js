require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');

connectDB();
const app = express();

// middleware
app.use(express.json());
// app.use(express.bodyParser());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRoutes);

// app.use('/api/todos', require('./routes/productRoutes'));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
