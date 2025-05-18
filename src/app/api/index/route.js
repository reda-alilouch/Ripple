import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Bienvenue sur l'API Spotify App",
    endpoints: [
      "/api/save-tracks",
      "/api/get-tracks",
      "/api/save-artists",
      "/api/save-albums",
      "/api/save-playlists",
    ],
  });
}
