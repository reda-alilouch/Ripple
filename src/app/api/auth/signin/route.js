// src/app/api/auth/signin/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });
    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json(
        { success: false, error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      spotifyConnected: user.spotifyConnected,
    };

    return NextResponse.json(
      { success: true, user: userResponse, token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur signin:", error.message);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur", details: error.message },
      { status: 500 }
    );
  }
}