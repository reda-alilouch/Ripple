import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

// Générer un token JWT
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Vérifier un token JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hasher un mot de passe
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Comparer un mot de passe
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Générer une chaîne aléatoire pour l'état Spotify
export const generateState = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// URL d'autorisation Spotify
export const getSpotifyAuthUrl = (state) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private'
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: state
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};