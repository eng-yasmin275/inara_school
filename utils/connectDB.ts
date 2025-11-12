import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    const uri = process.env.MONGO_URI; // make sure .env.local has this
    if (!uri) throw new Error("MONGO_URI is missing in .env.local");
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

export default connectDB;
