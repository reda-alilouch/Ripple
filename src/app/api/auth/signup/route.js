import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validation des données
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Le mot de passe doit contenir au moins 6 caractères",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = {
      name,
      email,
      password: hashedPassword,
      spotifyConnected: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(user);

    // Générer le token JWT
    const token = generateToken({
      userId: result.insertedId,
      email: user.email,
      name: user.name,
    });

    // Réponse sans le mot de passe
    const userResponse = {
      id: result.insertedId,
      name: user.name,
      email: user.email,
      spotifyConnected: user.spotifyConnected,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès",
        user: userResponse,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur signup:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
/*
Dans MongoDB, ce code effectue les opérations suivantes :

1. Connexion à la base de données :
   - Utilise la fonction connectMongoDB() pour établir la connexion
   - Vérifie l'état de la connexion avant les opérations
   - Utilise l'URI MongoDB stocké dans les variables d'environnement

2. Collection "users" :
   - Structure du document utilisateur :
     {
       _id: ObjectId (généré automatiquement),
       name: String,
       email: String (unique),
       password: String (hashé),
       spotifyConnected: Boolean,
       createdAt: Date,
       updatedAt: Date
     }

3. Opérations effectuées :
   - Recherche par email pour vérifier les doublons :
     db.collection("users").findOne({ email })
   
   - Insertion nouvel utilisateur :
     db.collection("users").insertOne({
       name,
       email,
       password: hashedPassword,
       spotifyConnected: false,
       createdAt: new Date(),
       updatedAt: new Date()
     })

4. Indexes recommandés :
   - Index unique sur email
   - Index sur createdAt pour les requêtes temporelles

5. Bonnes pratiques :
   - Validation des données avant insertion
   - Gestion des erreurs MongoDB
   - Nettoyage des données sensibles avant envoi
*/

