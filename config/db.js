const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected aindhi raaa babuu", conn.connection.host);
  } catch (error) {
    console.error("❌ DataBase lo error Vundi:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
