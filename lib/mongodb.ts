import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!MONGO_URI) {
    throw new Error(
      "Please define MONGO_URI or MONGODB_URI inside .env.local"
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
