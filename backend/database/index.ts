import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // ต้องใช้ process.env.MONGODB_URI เท่านั้น ห้ามใส่ localhost
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};