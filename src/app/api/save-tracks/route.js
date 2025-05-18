// app/api/save-tracks/route.js

import { getAccessToken } from "@/lib/spotify/getToken";
import { fetchAllSpotifyData } from "@/lib/spotify/fetchData";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Track from "@/src/models/Track"; // Importer le modèle Track

// GET: récupérer les données Spotify
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "daft punk";

    const accessToken = await getAccessToken();
    const data = await fetchAllSpotifyData(accessToken, query);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur GET:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: enregistrer les pistes dans MongoDB
// app/api/save-tracks/route.js

export async function POST(req) {
  try {
    const { tracks } = await req.json(); // Récupérer les données du corps de la requête

    await connectToDatabase(); // Assurez-vous que la base de données est connectée via Mongoose

    // Pour chaque piste, on essaie de l'ajouter à la base de données via Mongoose
    const promises = tracks.map(async (track) => {
      const simplified = {
        spotifyId: track.id, // Remplace "id" par "spotifyId" pour le modèle Mongoose
        name: track.name,
        album: track.album?.name,
        artists: track.artists?.map((artist) => artist.name), // Transforme les artistes en tableau de noms
        duration_ms: track.duration_ms,
        preview_url: track.preview_url,
      };

      // Utiliser Mongoose pour créer ou mettre à jour les pistes dans la DB
      await Track.findOneAndUpdate(
        { spotifyId: simplified.spotifyId }, // Utiliser l'ID de Spotify pour la recherche
        simplified, // Les données simplifiées à enregistrer
        { upsert: true } // Si non trouvé, insérer une nouvelle entrée
      );
    });

    // Attendre que toutes les opérations soient terminées
    await Promise.all(promises);

    return NextResponse.json({ success: true, inserted: tracks.length });
  } catch (error) {
    console.error("Erreur POST:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
