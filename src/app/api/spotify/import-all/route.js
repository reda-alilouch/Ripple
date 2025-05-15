import { getAccessToken } from "@/lib/spotify/getToken";
import { fetchAllSpotifyData } from "@/lib/spotify/fetchData";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const accessToken = await getAccessToken();

    const query = "daft punk"; // Tu peux modifier ou passer dynamiquement plus tard

    const data = await fetchAllSpotifyData(accessToken, query);

    console.log("🎧 Données Spotify récupérées :", data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Erreur :", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
