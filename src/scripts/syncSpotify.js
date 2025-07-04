import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env.local") });

// Vérifier que les variables d'environnement sont chargées
console.log("Variables d'environnement chargées:");
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "✓ Configuré" : "✗ Manquant"
);
console.log(
  "SPOTIFY_CLIENT_ID:",
  process.env.SPOTIFY_CLIENT_ID ? "✓ Configuré" : "✗ Manquant"
);
console.log(
  "SPOTIFY_CLIENT_SECRET:",
  process.env.SPOTIFY_CLIENT_SECRET ? "✓ Configuré" : "✗ Manquant"
);

import { connectMongoDB } from "../lib/mongodb.js";
import Titre from "../models/Titre.js";
import Artiste from "../models/Artiste.js";
import Album from "../models/Album.js";
import Playlist from "../models/Playlist.js";
import {
  getSpotifyTracks,
  getSpotifyArtists,
  getSpotifyAlbums,
  getSpotifyPlaylists,
} from "../lib/spotify.js";

async function syncAll() {
  try {
    await connectMongoDB();

    // Titres
    const tracks = await getSpotifyTracks();
    for (const track of tracks) {
      await Titre.updateOne(
        { spotifyId: track.spotifyId },
        { $set: track },
        { upsert: true }
      );
    }

    // Artistes
    const artists = await getSpotifyArtists();
    for (const artist of artists) {
      await Artiste.updateOne(
        { spotifyId: artist.spotifyId },
        { $set: artist },
        { upsert: true }
      );
    }

    // Albums
    const albums = await getSpotifyAlbums();
    for (const album of albums) {
      album.image = (album.images && album.images[0]?.url) || "";
      await Album.updateOne(
        { spotifyId: album.spotifyId },
        { $set: album },
        { upsert: true }
      );
    }

    // Playlists
    const playlists = await getSpotifyPlaylists();
    for (const playlist of playlists) {
      playlist.image =
        (playlist.images && playlist.images[0]?.url) || playlist.image || "";
      await Playlist.updateOne(
        { spotifyId: playlist.spotifyId },
        { $set: playlist },
        { upsert: true }
      );
    }
  } catch (error) {
    process.exit(1);
  }
}

syncAll();
