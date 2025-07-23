import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Album from "@/models/Album";

export async function GET() {
  try {
    await connectDB();

    // Récupérer les 4 premiers albums depuis MongoDB
    const albums = await Album.find({}).limit(4).sort({ createdAt: -1 }).lean();

    // Transformer les données pour correspondre au format attendu
    const formattedAlbums = albums.map((album) => {
      // Vérifier et nettoyer l'URL de l'image
      let imageUrl = "/default-album.jpg"; // Image par défaut

      // Priorité : image à la racine, sinon dans images[0].url
      if (album.image && album.image.trim() !== "") {
        try {
          new URL(album.image);
          imageUrl = album.image;
        } catch (e) {
          console.warn(
            `URL d'image invalide pour l'album ${album.name}:`,
            album.image
          );
        }
      } else if (Array.isArray(album.images) && album.images[0]?.url) {
        try {
          new URL(album.images[0].url);
          imageUrl = album.images[0].url;
        } catch (e) {
          console.warn(
            `URL d'image invalide (images[0]) pour l'album ${album.name}:`,
            album.images[0].url
          );
        }
      }

      return {
        id: album._id.toString(),
        name: album.name,
        artists: album.artists || [],
        image: imageUrl,
        release_date: album.release_date,
        spotifyId: album.spotifyId,
      };
    });

    return NextResponse.json({
      albums: formattedAlbums,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des albums:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des albums",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
