import { NextResponse } from "next/server";
import { Track, Artist } from "@/models/spotify";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit")) || 20;

    let data = {};

    if (type === "all" || type === "tracks") {
      data.tracks = await Track.find()
        .sort({ popularity: -1 })
        .limit(limit)
        .lean();
    }

    if (type === "all" || type === "artists") {
      data.artists = await Artist.find()
        .sort({ popularity: -1 })
        .limit(limit)
        .lean();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
