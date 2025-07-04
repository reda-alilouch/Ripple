import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Titre from "@/models/Titre";

export async function GET() {
  try {
    await connectDB();

    // Récupérer les 9 premiers titres depuis MongoDB
    const titres = await Titre.find({})
      .limit(9)
      .sort({ createdAt: -1 }) // Trier par date de création décroissante
      .lean(); // Pour de meilleures performances

    console.log("Titres récupérés de MongoDB:", titres);

    // Transformer les données pour correspondre au format attendu par le composant
    const formattedTitres = titres.map((titre) => {
      // Vérifier et nettoyer l'URL de l'image
      let imageUrl = "/default-album.jpg"; // Image par défaut

      if (titre.image && titre.image.trim() !== "") {
        // Vérifier si l'URL est valide
        try {
          new URL(titre.image);
          imageUrl = titre.image;
        } catch (e) {
          console.warn(
            `URL d'image invalide pour le titre ${titre.name}:`,
            titre.image
          );
        }
      }

      return {
        id: titre._id.toString(),
        _id: titre._id.toString(),
        name: titre.name,
        artists: titre.artists.map((artistName) => ({
          name: artistName,
          id: null, // Si tu n'as pas l'ID Spotify des artistes
        })),
        album: {
          name: titre.album,
          id: null,
        },
        image: imageUrl,
        preview_url: titre.previewUrl,
        external_url: `https://open.spotify.com/track/${titre.spotifyId}`,
        duration_ms: titre.duration,
      };
    });

    console.log("Titres formatés:", formattedTitres);

    return NextResponse.json({
      tracks: formattedTitres,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des titres:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des titres",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
