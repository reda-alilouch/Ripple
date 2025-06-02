import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
    hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
    hasSpotifyRedirectUri: !!process.env.SPOTIFY_REDIRECT_URI,
    hasMongoDbUri: !!process.env.MONGODB_URI,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  });
}
