import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import User from "@/models/users";

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

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Le mot de passe doit contenir au moins 6 caractères",
        },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: "credentials",
      emailVerified: new Date(),
      createdAt: new Date(),
    });

    await user.save();

    // Réponse sans le mot de passe
    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès",
        user: { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email,
          provider: user.provider 
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur signup:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors de l'inscription",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Méthode non autorisée" },
    { status: 405 }
  );
}