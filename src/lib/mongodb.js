import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ MONGODB_URI manquant dans .env.local");
}

let client;
let clientPromise;

if (!global._mongoClient) {
  client = new MongoClient(uri);
  global._mongoClient = client;
  clientPromise = client.connect();
} else {
  clientPromise = Promise.resolve(global._mongoClient);
}

export default clientPromise;
