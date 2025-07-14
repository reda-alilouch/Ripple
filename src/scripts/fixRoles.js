import mongoose from "mongoose";
import User from "../models/users.js";
import { connectMongoDB } from "../lib/mongodb.js";
import "dotenv/config";



async function fixGoogleProviders() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/ripple"
  );
  const res = await User.updateMany(
    { provider: "credentials", password: { $exists: false } },
    { $set: { provider: "google" } }
  );

  await mongoose.disconnect();
}


fixGoogleProviders();
