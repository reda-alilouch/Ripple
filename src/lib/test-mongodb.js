// src/lib/test-mongodb.js
import { config } from "dotenv";

config(); // Charge les variables d'environnement avant tout
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Débogage

import { connectMongoDB } from "./mongodb.js";

async function testConnection() {
  try {
    console.log("Tentative de connexion à MongoDB avec Mongoose...");
    const conn = await connectMongoDB();
    console.log("Connexion à MongoDB réussie avec Mongoose");
    console.log("État de la connexion:", conn.readyState); // 1 = connecté
  } catch (error) {
    console.error("Erreur de connexion MongoDB:", error);
  }
}

testConnection();
