import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/config/auth.config";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { image } = await request.json();
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Aucune image reçue" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    await User.updateOne({ _id: session.user.id }, { $set: { image } });

    const updatedUser = await User.findById(session.user.id);
    return NextResponse.json({ success: true, image: updatedUser.image });
  } catch (error) {
    console.error("Erreur upload image profil:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }
  return NextResponse.json({ success: true, image: session.user.image });
}
