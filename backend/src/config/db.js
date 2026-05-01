const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ MongoDB connected successfully");
  } catch (err) {
    console.error("✗ DB connection error:", err.message);
    console.log("⚠ Server running without database. Please whitelist your IP in MongoDB Atlas.");
    console.log("⚠ Database will be available once connection is established.");
  }
};

module.exports = connectDB;
