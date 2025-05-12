require('dotenv').config();  // Load environment variables from .env file
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('MONGO_URI is not defined in your .env file');
      return;
    }

    // Remove the deprecated options
    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
