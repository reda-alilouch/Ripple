import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artiste from "@/models/Artiste";

export async function GET(req) {
  try {
    await connectDB();

    // Pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const total = await Artiste.countDocuments();
    const artistes = await Artiste.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    // Transformer les données pour correspondre au format attendu
    const formattedArtistes = artistes.map((artiste) => {
      // Vérifier et nettoyer l'URL de l'image
      let imageUrl = "/default-artist.svg"; // Image par défaut

      if (artiste.image && artiste.image.trim() !== "") {
        try {
          new URL(artiste.image);
          imageUrl = artiste.image;
        } catch (e) {
          console.warn(
            `URL d'image invalide pour l'artiste ${artiste.name}:`,
            artiste.image
          );
        }
      }

      return {
        id: artiste._id.toString(),
        name: artiste.name,
        image: imageUrl,
        genres: artiste.genres || [],
        spotifyId: artiste.spotifyId,
      };
    });

    return NextResponse.json({
      artists: formattedArtistes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des artistes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
