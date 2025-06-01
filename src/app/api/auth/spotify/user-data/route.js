

export async function GET(req) {
  const access_token = req.headers.get("Authorization")?.split(" ")[1];

  if (!access_token) {
    return Response.json({ error: "Access token manquant" }, { status: 401 });
  }

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  const [topArtists, topTracks, playlists] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/top/artists", { headers }),
    fetch("https://api.spotify.com/v1/me/top/tracks", { headers }),
    fetch("https://api.spotify.com/v1/me/playlists", { headers }),
  ]);

  const [artistsData, tracksData, playlistsData] = await Promise.all([
    topArtists.json(),
    topTracks.json(),
    playlists.json(),
  ]);

  return Response.json({
    artists: artistsData.items,
    tracks: tracksData.items,
    playlists: playlistsData.items,
  });
}
