import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function GET() {
  try {
    await connectDB();

    // Récupérer les 6 premières playlists depuis MongoDB
    const playlists = await Playlist.find({})
      .limit(6)
      .sort({ createdAt: -1 })
      .lean();

    console.log("Playlists récupérées de MongoDB:", playlists);

    // Transformer les données pour correspondre au format attendu
    const formattedPlaylists = playlists.map((playlist) => {
      // Vérifier et nettoyer l'URL de l'image
      let imageUrl = "/default-playlist.svg"; // Image par défaut

      // Priorité : image à la racine, sinon dans images[0].url
      if (playlist.image && playlist.image.trim() !== "") {
        try {
          new URL(playlist.image);
          imageUrl = playlist.image;
        } catch (e) {
          console.warn(
            `URL d'image invalide pour la playlist ${playlist.name}:`,
            playlist.image
          );
        }
      } else if (Array.isArray(playlist.images) && playlist.images[0]?.url) {
        try {
          new URL(playlist.images[0].url);
          imageUrl = playlist.images[0].url;
        } catch (e) {
          console.warn(
            `URL d'image invalide (images[0]) pour la playlist ${playlist.name}:`,
            playlist.images[0].url
          );
        }
      }

      return {
        id: playlist._id.toString(),
        name: playlist.name,
        description: playlist.description || "",
        owner: playlist.owner || "",
        image: imageUrl,
        tracks: playlist.tracks || [],
        spotifyId: playlist.spotifyId,
      };
    });

    console.log("Playlists formatées:", formattedPlaylists);

    return NextResponse.json({
      playlists: formattedPlaylists,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des playlists:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des playlists",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
