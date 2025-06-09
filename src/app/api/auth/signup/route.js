// src/app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

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
    const db = client.db(process.env.MONGODB_DB || "ripple");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = {
      name,
      email,
      password: hashedPassword,
      spotifyConnected: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(user);

    const token = generateToken({
      userId: result.insertedId,
      email: user.email,
      name: user.name,
    });

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
    console.error("Erreur signup:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
