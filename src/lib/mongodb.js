// src/lib/mongodb.js
import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Veuillez ajouter votre URI MongoDB dans .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

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

export default clientPromise;
