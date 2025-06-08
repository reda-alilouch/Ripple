import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";
import { comparePassword } from "@/lib/auth";

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

    // Connexion à MongoDB
    await connectMongoDB();

    // Trouver l'utilisateur
    const user = await User.findOne({ email, provider: "credentials" });
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

    // Réponse sans le mot de passe
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      provider: user.provider,
    };

    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: userResponse,
    });
  } catch (error) {
    console.error("Erreur signin:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
