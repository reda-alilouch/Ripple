import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotify.js";

// GET /api/spotify/search?q=eminem
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Le paramètre de recherche 'q' est requis" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();
    const data = await fetchAllSpotifyData(accessToken, query);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur de recherche Spotify:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la recherche" },
      { status: 500 }
    );
  }
}

async function fetchAllSpotifyData(accessToken, query) {
  const types = ["album", "artist", "track", "playlist"];
  const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=${types.join(",")}&limit=10`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // Cache les résultats pendant 1 heure
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Erreur Spotify API:", errorData);
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    query,
    tracks: data.tracks?.items || [],
    albums: data.albums?.items || [],
    artists: data.artists?.items || [],
    playlists: data.playlists?.items || [],
  };
}
