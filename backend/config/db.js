const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the provided MONGO_URI.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
