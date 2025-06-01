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
