import { NextResponse } from "next/server";
import { getAccessToken } from "@/src/lib/spotify.js";
// GET /api/spotify/search?q=eminem
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "top hits"; // valeur par défaut

  const accessToken = await getAccessToken();
  const data = await fetchAllSpotifyData(accessToken, query);

  return Response.json(data);
}

async function fetchAllSpotifyData(accessToken, query) {
  const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=album,artist,track,playlist&limit=10`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Échec de récupération des données Spotify");
  }

  const data = await response.json();

  return {
    albums: data.albums?.items || [],
    artists: data.artists?.items || [],
    tracks: data.tracks?.items || [],
    playlists: data.playlists?.items || [],
  };
}
