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
    console.log("Début de la synchronisation...");
    await connectMongoDB();
    console.log("Connexion MongoDB établie");

    // Titres
    console.log("Récupération des titres...");
    const tracks = await getSpotifyTracks();
    console.log(`${tracks.length} titres récupérés`);
    for (const track of tracks) {
      await Titre.updateOne(
        { spotifyId: track.spotifyId },
        { $set: track },
        { upsert: true }
      );
    }
    console.log("Titres synchronisés");

    // Artistes
    console.log("Récupération des artistes...");
    const artists = await getSpotifyArtists();
    console.log(`${artists.length} artistes récupérés`);
    for (const artist of artists) {
      await Artiste.updateOne(
        { spotifyId: artist.spotifyId },
        { $set: artist },
        { upsert: true }
      );
    }
    console.log("Artistes synchronisés");

    // Albums
    console.log("Récupération des albums...");
    const albums = await getSpotifyAlbums();
    console.log(`${albums.length} albums récupérés`);
    for (const album of albums) {
      album.image = (album.images && album.images[0]?.url) || "";
      await Album.updateOne(
        { spotifyId: album.spotifyId },
        { $set: album },
        { upsert: true }
      );
    }
    console.log("Albums synchronisés");

    // Playlists
    console.log("Récupération des playlists...");
    const playlists = await getSpotifyPlaylists();
    console.log(`${playlists.length} playlists récupérées`);
    for (const playlist of playlists) {
      playlist.image =
        (playlist.images && playlist.images[0]?.url) || playlist.image || "";
      await Playlist.updateOne(
        { spotifyId: playlist.spotifyId },
        { $set: playlist },
        { upsert: true }
      );
    }
    console.log("Playlists synchronisées");

    console.log("Synchronisation terminée avec succès !");
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
    process.exit(1);
  }
}

syncAll();
