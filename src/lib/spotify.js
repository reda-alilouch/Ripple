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
    throw error;
  }
};

// Récupère un access token Spotify (client credentials)
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
    throw error;
  }
};

// Récupère tous les tracks d'une playlist Spotify
export const getSpotifyTracks = async (playlistId, market = "FR") => {
  const accessToken = await getAccessToken();
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=${market}&limit=100`;
  let tracks = [];
  let next = url;

  while (next) {
    try {
      const res = await axios.get(next, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      tracks = tracks.concat(res.data.items);
      next = res.data.next;
    } catch (error) {
      console.error("Spotify API error:", error.response?.data || error);
      throw error;
    }
  }
  return tracks;
};

// Récupère tous les artistes d'une liste d'IDs
export const getSpotifyArtists = async (artistIds = [], market = "US") => {
  const accessToken = await getAccessToken();
  let artists = [];
  // Spotify API: max 50 IDs per request
  for (let i = 0; i < artistIds.length; i += 50) {
    const ids = artistIds.slice(i, i + 50).join(",");
    const url = `https://api.spotify.com/v1/artists?ids=${ids}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    artists = artists.concat(res.data.artists);
  }
  return artists;
};

// Récupère tous les albums d'une liste d'IDs
export const getSpotifyAlbums = async (albumIds = [], market = "US") => {
  const accessToken = await getAccessToken();
  let albums = [];
  // Spotify API: max 20 IDs per request
  for (let i = 0; i < albumIds.length; i += 20) {
    const ids = albumIds.slice(i, i + 20).join(",");
    const url = `https://api.spotify.com/v1/albums?ids=${ids}&market=${market}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    albums = albums.concat(res.data.albums);
  }
  return albums;
};

// Récupère les infos d'une playlist
export const getSpotifyPlaylists = async (playlistIds = [], market = "US") => {
  const accessToken = await getAccessToken();
  let playlists = [];
  for (const playlistId of playlistIds) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}?market=${market}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    playlists.push(res.data);
  }
  return playlists;
};
