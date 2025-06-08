import mongoose from "mongoose";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {
  family: 4, // Force IPv4
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
export { clientPromise };

// Mongoose connection for models
export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
    });

    console.log("MongoDB Connected");
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
