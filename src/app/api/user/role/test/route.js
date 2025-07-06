import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/config/auth.config";

export async function GET(request) {
  try {
    const session = await getServerSession(authConfig);

    console.log("Session:", session);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Non autorisé - Pas de session",
          session: null,
        },
        { status: 401 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(session.user.id);
    console.log(
      "Utilisateur trouvé:",
      user
        ? {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            hasArtistProfile: !!user.artistProfile,
            hasListenerProfile: !!user.listenerProfile,
          }
        : null
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur non trouvé",
          session: session,
          userId: session.user.id,
        },
        { status: 404 }
      );
    }

    // Si l'utilisateur n'a pas de rôle, on l'initialise comme listener
    if (!user.role) {
      user.role = "listener";
      await user.save();
      console.log("Rôle initialisé comme listener");
    }

    return NextResponse.json({
      success: true,
      session: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasArtistProfile: !!user.artistProfile,
        hasListenerProfile: !!user.listenerProfile,
      },
      message: "Test de diagnostic réussi",
    });
  } catch (error) {
    console.error("Erreur lors du test:", error);
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

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Non autorisé",
        },
        { status: 401 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur non trouvé",
        },
        { status: 404 }
      );
    }

    // Forcer l'initialisation du rôle comme listener
    user.role = "listener";
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Rôle initialisé comme listener",
      role: user.role,
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}
