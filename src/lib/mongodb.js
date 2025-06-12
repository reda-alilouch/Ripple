// src/lib/mongodb.js
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Options de connexion communes
const mongoOptions = {
  family: 4, // Forcer IPv4
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Récupérer l'URI
let uri = process.env.MONGODB_URI;

// Si l'URI ne contient pas déjà une adresse IP explicite
if (!uri.includes('127.0.0.1') && !uri.includes('localhost')) {
  uri = uri.replace('mongodb://', 'mongodb://127.0.0.1:');
}

// Partie MongoClient pour l'authentification
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, mongoOptions);  // Utiliser mongoOptions au lieu de options
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, mongoOptions);  // Et ici aussi
  clientPromise = client.connect();
}

// Partie Mongoose pour les modèles
const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    
    const conn = await mongoose.connect(uri, {
      ...mongoOptions,
      maxPoolSize: 10,
    });
    
    console.log("MongoDB Connected");
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export { clientPromise, connectMongoDB };
export default connectMongoDB;