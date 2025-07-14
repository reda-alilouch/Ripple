import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/config/auth.config";

export async function POST(request) {

  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { role, profileData } = await request.json();

    if (!role || !["listener", "artist"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Rôle invalide" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Trouver l'utilisateur
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Initialiser le rôle si absent
    if (!user.role) {
      user.role = "listener";
      await user.save();
    }

    // Vérifier si l'utilisateur a déjà un rôle défini (autre que listener)
    if (user.role && user.role !== "listener") {
      return NextResponse.json(
        { success: false, error: "Le rôle a déjà été défini" },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle de l'utilisateur
    user.role = role;

    // Créer le profil correspondant selon le rôle
    if (role === "artist") {
      if (!profileData || !profileData.stageName || !profileData.genres) {
        return NextResponse.json(
          { success: false, error: "Données de profil artiste requises" },
          { status: 400 }
        );
      }

      // Vérifier si le nom de scène est déjà pris par un autre utilisateur
      const existingArtist = await User.findOne({
        "artistProfile.stageName": profileData.stageName,
        _id: { $ne: user._id },
      });
      if (existingArtist) {
        return NextResponse.json(
          { success: false, error: "Ce nom de scène est déjà utilisé" },
          { status: 409 }
        );
      }

      // Mettre à jour le profil utilisateur avec les données artiste
      user.artistProfile = {
        stageName: profileData.stageName,
        bio: profileData.bio || "",
        genres: profileData.genres,
        socialLinks: profileData.socialLinks || {},
      };
    } else if (role === "listener") {
      // Mettre à jour le profil utilisateur avec les données auditeur
      user.listenerProfile = {
        favoriteGenres: profileData?.favoriteGenres || [],
      };
    }

    await user.save();

    // Avant de retourner l'utilisateur, le convertir en objet simple
    const userObj = user.toObject ? user.toObject() : user;
    userObj._id = userObj._id?.toString?.() || userObj._id;

    return NextResponse.json({
      success: true,
      message: `Profil ${role} créé avec succès`,
      role: role,
      user: userObj,
    });
  } catch (error) {
    console.error("Erreur lors de la création du rôle:", error, error?.stack);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      role: user.role,
      hasProfile: user.role !== "listener",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
