// lib/mongodb.js

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Dans le mode développement, on garde une seule instance pour éviter la reconnexion constante
  clientPromise = globalThis.mongoClient ??= client.connect();
} else {
  // Dans les autres environnements, chaque requête aura une nouvelle instance
  clientPromise = client.connect();
}

export default clientPromise;
