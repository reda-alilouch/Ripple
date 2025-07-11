import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Chargement des variables d’environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env.local") });

console.log("📦 Chargement des variables d'environnement...");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ OK" : "✗ Manquant");
console.log(
  "SPOTIFY_CLIENT_ID:",
  process.env.SPOTIFY_CLIENT_ID ? "✓ OK" : "✗ Manquant"
);
console.log(
  "SPOTIFY_CLIENT_SECRET:",
  process.env.SPOTIFY_CLIENT_SECRET ? "✓ OK" : "✗ Manquant"
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
    console.log("✅ Connexion à MongoDB établie");

    // 🔹 Synchronisation des titres
    console.log("\n🎵 Extraction des titres depuis l’API Spotify...");
    const tracks = await getSpotifyTracks();
    console.log(`📥 ${tracks.length} titres récupérés.`);

    for (const [index, track] of tracks.entries()) {
      const trackData = {
        ...track,
        uri: track.uri || `spotify:track:${track.spotifyId}`,
        previewUrl: track.preview_url || null,
        image: track.album?.images?.[0]?.url || track.image || "",
        artists: track.artists || [],
        album: {
          id: track.album?.id || null,
          name: track.album?.name || "",
          images: track.album?.images || [],
        },
        duration_ms: track.duration_ms || 0,
        explicit: track.explicit || false,
        popularity: track.popularity || 0,
        name: track.name || "Unknown Track",
      };

      await Titre.updateOne(
        { spotifyId: track.spotifyId },
        { $set: trackData },
        { upsert: true }
      );

      if ((index + 1) % 10 === 0 || index === tracks.length - 1) {
        console.log(`✔️ Titres enregistrés : ${index + 1}/${tracks.length}`);
      }
    }

    // 🔹 Synchronisation des artistes
    console.log("\n🎤 Extraction des artistes...");
    const artists = await getSpotifyArtists();
    console.log(`📥 ${artists.length} artistes récupérés.`);

    for (const [index, artist] of artists.entries()) {
      const artistData = {
        ...artist,
        image: artist.images?.[0]?.url || artist.image || "",
        uri: artist.uri || `spotify:artist:${artist.spotifyId}`,
        followers: artist.followers?.total || 0,
        popularity: artist.popularity || 0,
        genres: artist.genres || [],
      };

      await Artiste.updateOne(
        { spotifyId: artist.spotifyId },
        { $set: artistData },
        { upsert: true }
      );

      if ((index + 1) % 10 === 0 || index === artists.length - 1) {
        console.log(`✔️ Artistes enregistrés : ${index + 1}/${artists.length}`);
      }
    }

    // 🔹 Synchronisation des albums
    console.log("\n💿 Extraction des albums...");
    const albums = await getSpotifyAlbums();
    console.log(`📥 ${albums.length} albums récupérés.`);

    for (const [index, album] of albums.entries()) {
      const albumData = {
        ...album,
        image: album.images?.[0]?.url || album.image || "",
        uri: album.uri || `spotify:album:${album.spotifyId}`,
        artists: album.artists || [],
        release_date: album.release_date || null,
        total_tracks: album.total_tracks || 0,
        album_type: album.album_type || "album",
      };

      await Album.updateOne(
        { spotifyId: album.spotifyId },
        { $set: albumData },
        { upsert: true }
      );

      if ((index + 1) % 10 === 0 || index === albums.length - 1) {
        console.log(`✔️ Albums enregistrés : ${index + 1}/${albums.length}`);
      }
    }

    // 🔹 Synchronisation des playlists
    console.log("\n📚 Extraction des playlists...");
    const playlists = await getSpotifyPlaylists();
    console.log(`📥 ${playlists.length} playlists récupérées.`);

    for (const [index, playlist] of playlists.entries()) {
      const playlistData = {
        ...playlist,
        image: playlist.images?.[0]?.url || playlist.image || "",
        uri: playlist.uri || `spotify:playlist:${playlist.spotifyId}`,
        tracks: playlist.tracks || [],
        total_tracks: playlist.tracks?.total || 0,
        public: playlist.public || false,
        collaborative: playlist.collaborative || false,
        description: playlist.description || "",
      };

      await Playlist.updateOne(
        { spotifyId: playlist.spotifyId },
        { $set: playlistData },
        { upsert: true }
      );

      if ((index + 1) % 5 === 0 || index === playlists.length - 1) {
        console.log(
          `✔️ Playlists enregistrées : ${index + 1}/${playlists.length}`
        );
      }
    }

    console.log("\n🎉 Synchronisation terminée avec succès !");
  } catch (error) {
    console.error("❌ Échec de la synchronisation :", error);
    process.exit(1);
  }
}

syncAll();
