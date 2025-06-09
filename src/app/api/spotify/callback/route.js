import "server-only"; // Ajoute une protection pour server-only

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { exchangeCodeForToken, getSpotifyProfile } from "@/lib/spotify";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profil?error=spotify_denied`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profil?error=missing_params`
      );
    }

    // Extraire le token de l'état
    const [stateCode, userToken] = state.split("_");
    if (!userToken) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/profil?error=invalid_state`
      );
    }

    // Vérifier le token utilisateur
    const userData = verifyToken(userToken);
    if (!userData) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/signin?error=invalid_token`
      );
    }

    // Échanger le code contre un token d'accès Spotify
    const tokenData = await exchangeCodeForToken(code);

    // Obtenir le profil Spotify
    const spotifyProfile = await getSpotifyProfile(tokenData.access_token);

    // Sauvegarder les données Spotify dans la base de données
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    await db.collection("users").updateOne(
      { _id: new ObjectId(userData.userId) },
      {
        $set: {
          spotifyConnected: true,
          spotifyProfile: {
            id: spotifyProfile.id,
            display_name: spotifyProfile.display_name,
            email: spotifyProfile.email,
            images: spotifyProfile.images,
            followers: spotifyProfile.followers,
            country: spotifyProfile.country,
          },
          spotifyTokens: {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
            scope: tokenData.scope,
          },
          updatedAt: new Date(),
        },
      }
    );

    // Rediriger vers le profil avec succès
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/profil?spotify=connected`
    );
  } catch (error) {
    console.error("Erreur callback Spotify:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/profil?error=spotify_callback`
    );
  }
}
