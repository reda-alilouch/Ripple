// src/lib/auth-providers.js
import GoogleProvider from "@auth/core/providers/google";
import CredentialsProvider from "@auth/core/providers/credentials";

export const authProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // Logique d'authentification personnalisée ici
      // Exemple : Vérifier les identifiants dans MongoDB
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection("users").findOne({ email: credentials.email });
      if (user && (await compare(credentials.password, user.password))) {
        return { id: user._id, email: user.email, name: user.name };
      }
      return null; // Retourner null si les identifiants sont incorrects
    },
  }),
];

// Si vous utilisez bcryptjs pour le hachage (présent dans votre package.json)
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";