const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000 // Fail fast if MongoDB not available
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    console.warn('⚠️  Running in DEMO MODE without MongoDB - data will not persist!');
    // Don't exit - continue without MongoDB for demo
  }
};

module.exports = connectDB;
