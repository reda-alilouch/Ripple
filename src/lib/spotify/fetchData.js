export async function fetchAllSpotifyData(accessToken, query) {
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

  // Les genres peuvent être extraits à partir des artistes
  const genres = data.artists?.items
    ?.flatMap((artist) => artist.genres)
    ?.filter((genre, index, self) => self.indexOf(genre) === index); // unique

  return {
    albums: data.albums?.items || [],
    artists: data.artists?.items || [],
    tracks: data.tracks?.items || [],
    playlists: data.playlists?.items || [],
    genres: genres || [],
  };
}
