import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // dbName: "schoolDB", // optional: only if your URI doesn't have a DB
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
