import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI!;

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGO_URI);
}
