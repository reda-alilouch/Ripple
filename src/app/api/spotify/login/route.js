export async function GET() {
  const scope = [
    "user-read-email",
    "user-top-read",
    "playlist-read-private",
    "user-library-read",
    "user-read-playback-state",
    "user-read-currently-playing",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  return Response.redirect("https://accounts.spotify.com/authorize?" + params.toString(), 302);
}
