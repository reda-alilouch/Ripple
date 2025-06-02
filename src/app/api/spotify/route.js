import { NextResponse } from "next/server";
import { generateState, getSpotifyAuthUrl } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token d'authentification requis" },
        { status: 401 }
      );
    }

    // Générer un état unique pour la sécurité
    const state = generateState();

    // Stocker l'état et le token en session (vous pouvez utiliser Redis en production)
    const spotifyAuthUrl = getSpotifyAuthUrl(`${state}_${token}`);

    return NextResponse.json({
      success: true,
      authUrl: spotifyAuthUrl,
    });
  } catch (error) {
    console.error("Erreur auth Spotify:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la génération de l'URL d'authentification",
      },
      { status: 500 }
    );
  }
}
