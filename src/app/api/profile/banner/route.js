import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";

// GET - Récupérer l'image de bannière de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email })
      .select("bannerImage")
      .lean();

    return NextResponse.json({
      bannerImage: user?.bannerImage || null
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la bannière:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder l'image de bannière de l'utilisateur
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { bannerImage } = await request.json();

    if (!bannerImage) {
      return NextResponse.json(
        { error: "Image de bannière requise" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    // Mettre à jour l'utilisateur avec la nouvelle image de bannière
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { bannerImage },
      { new: true, select: "bannerImage" }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bannerImage: updatedUser.bannerImage
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la bannière:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer l'image de bannière de l'utilisateur
export async function DELETE() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectMongoDB();
    
    // Supprimer l'image de bannière
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $unset: { bannerImage: 1 } },
      { new: true, select: "bannerImage" }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bannerImage: null
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la bannière:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 