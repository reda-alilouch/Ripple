import axios from "axios";

export async function GET(req) {
  const access_token = req.headers.get("Authorization")?.split(" ")[1];

  if (!access_token) {
    return Response.json({ error: "Access token manquant" }, { status: 401 });
  }

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  const [artistsRes, tracksRes, playlistsRes] = await Promise.all([
    axios.get("https://api.spotify.com/v1/me/top/artists", { headers }),
    axios.get("https://api.spotify.com/v1/me/top/tracks", { headers }),
    axios.get("https://api.spotify.com/v1/me/playlists", { headers }),
  ]);

  const artistsData = artistsRes.data;
  const tracksData = tracksRes.data;
  const playlistsData = playlistsRes.data;

  return Response.json({
    artists: artistsData.items,
    tracks: tracksData.items,
    playlists: playlistsData.items,
  });
}
