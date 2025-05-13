import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("MongoDB URI manquant");

let cached = global.mongoose || { conn: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGODB_URI);
  global.mongoose = cached;

  return cached.conn;
}
