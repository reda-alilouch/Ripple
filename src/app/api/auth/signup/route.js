import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import User from "@/models/users";

export async function POST(request) {
  try {
    console.log("Début de la requête d'inscription");
    const { email, password, name } = await request.json();
    console.log("Données reçues:", { email, name });

    // Validation des données
    if (!email || !password || !name) {
      console.log("Champs manquants");
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log("Mot de passe trop court");
      return NextResponse.json(
        {
          success: false,
          error: "Le mot de passe doit contenir au moins 6 caractères",
        },
        { status: 400 }
      );
    }

    console.log("Connexion à MongoDB...");
    await connectMongoDB();
    console.log("Connecté à MongoDB");

    // Vérifier si l'utilisateur existe déjà
    console.log("Vérification de l'existence de l'utilisateur...");
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      console.log("Utilisateur existe déjà");
      return NextResponse.json(
        { success: false, error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    console.log("Hachage du mot de passe...");
    const hashedPassword = await hashPassword(password);

    console.log("Création de l'utilisateur...");
    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: "credentials",
      emailVerified: new Date(),
    });

    console.log("Sauvegarde de l'utilisateur...");
    await user.save();
    console.log("Utilisateur créé avec succès");

    return NextResponse.json(
      { success: true, message: "Compte créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors de l'inscription",
      },
      { status: 500 }
    );
  }
}
