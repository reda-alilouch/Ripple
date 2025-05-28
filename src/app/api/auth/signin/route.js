import clientPromise from "@/lib/mongodb";

import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Champs manquants" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ripple");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: "Email introuvable" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return Response.json(
        { success: false, message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      message: "Connexion réussie",
      user: {
        name: user.name || user.username || "",
        email: user.email,
        profileImage: user.profileImage || "/default-avatar.png",
      },
    });
  } catch (err) {
    console.error("Erreur serveur:", err);
    return Response.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
