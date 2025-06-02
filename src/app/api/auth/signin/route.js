import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Trouver l'utilisateur
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Mettre à jour lastLogin
    await db
      .collection("users")
      .updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    // Générer le token JWT
    const token = generateToken({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    // Réponse sans le mot de passe
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      spotifyConnected: user.spotifyConnected || false,
      spotifyProfile: user.spotifyProfile || null,
    };

    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Erreur signin:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
