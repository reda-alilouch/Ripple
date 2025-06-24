import axios from "axios";

// Échanger le code d'autorisation contre un token d'accès
export const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur échange token Spotify:", error.response?.data);
    throw error;
  }
};

// Rafraîchir le token d'accès
export const refreshSpotifyToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur refresh token Spotify:", error.response?.data);
    throw error;
  }
};

// Obtenir le profil utilisateur Spotify
export const getSpotifyProfile = async (accessToken) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur profil Spotify:", error.response?.data);
    throw error;
  }
};

// Obtenir les top tracks de l'utilisateur
export const getUserTopTracks = async (accessToken, limit = 20) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur top tracks Spotify:", error.response?.data);
    throw error;
  }
};

// Obtenir les playlists de l'utilisateur
export const getUserPlaylists = async (accessToken, limit = 50) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur playlists Spotify:", error.response?.data);
    throw error;
  }
};

// Obtenir un token d'accès client
export const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Erreur obtention token Spotify:", error.response?.data);
    throw error;
  }
};

// Récupérer des titres populaires (exemple: top tracks d'un artiste connu)
export const getSpotifyTracks = async () => {
  const accessToken = await getAccessToken();
  // Exemple: top tracks de l'artiste Drake (id: 3TVXtAsR1Inumwj472S9r4)
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4/top-tracks?market=FR`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data.tracks.map((track) => ({
    spotifyId: track.id,
    name: track.name,
    artists: track.artists.map((a) => a.name),
    album: track.album.name,
    duration: track.duration_ms,
    previewUrl: track.preview_url,
  }));
};

// Récupérer des artistes populaires avec pagination
export const getSpotifyArtists = async () => {
  const accessToken = await getAccessToken();
  let allArtists = [];
  let limit = 50;

  // Récupérer 100 artistes (2 pages de 50)
  for (let offset = 0; offset < 100; offset += limit) {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=pop&type=artist&limit=${limit}&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    allArtists = allArtists.concat(response.data.artists.items);

    // Stop si moins de 50 résultats (fin de la pagination)
    if (response.data.artists.items.length < limit) break;
  }

  return allArtists.map((artist) => ({
    spotifyId: artist.id,
    name: artist.name,
    genres: artist.genres,
    image: artist.images[0]?.url || "",
  }));
};

// Récupérer des albums populaires avec pagination
export const getSpotifyAlbums = async () => {
  const accessToken = await getAccessToken();
  let allAlbums = [];
  let limit = 50;

  // Récupérer 100 albums (2 pages de 50)
  for (let offset = 0; offset < 100; offset += limit) {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4/albums?market=FR&limit=${limit}&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    allAlbums = allAlbums.concat(response.data.items);

    // Stop si moins de 50 résultats (fin de la pagination)
    if (response.data.items.length < limit) break;
  }

  return allAlbums.map((album) => ({
    spotifyId: album.id,
    name: album.name,
    artists: album.artists.map((a) => a.name),
    release_date: album.release_date,
    image: album.images[0]?.url || "",
  }));
};

// Récupérer des playlists populaires avec pagination
export const getSpotifyPlaylists = async () => {
  const accessToken = await getAccessToken();
  let allPlaylists = [];
  let limit = 50;

  // Récupérer 100 playlists (2 pages de 50)
  for (let offset = 0; offset < 500; offset += limit) {
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=FR&limit=${limit}&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    allPlaylists = allPlaylists.concat(response.data.playlists.items);

    // Stop si moins de 50 résultats (fin de la pagination)
    if (response.data.playlists.items.length < limit) break;
  }

  return allPlaylists.map((playlist) => ({
    spotifyId: playlist.id,
    name: playlist.name,
    description: playlist.description,
    owner: playlist.owner.display_name,
    tracks: [], // Pour simplifier, on ne récupère pas les tracks ici
    image: playlist.images[0]?.url || "",
  }));
};
