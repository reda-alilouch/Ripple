import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env.local") });

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

// MODIFIE ICI pour ta playlist et ton market
const playlistId = "37i9dQZF1DXcBWIGoYBM5M"; // ID d'une playlist publique confirmée
const market = "FR"; // Région France

async function syncAll() {
  try {
    await connectMongoDB();

    const tracks = await getSpotifyTracks(playlistId, market);
    for (const track of tracks) {
      const t = track.track;
      if (!t) continue;
      const trackData = {
        spotifyId: t.id,
        uri: t.uri,
        preview_url: t.preview_url || null,
        image: t.album?.images?.[0]?.url || "",
        artists: t.artists?.map((a) => a.name) || [],
        album: {
          id: t.album?.id || null,
          name: t.album?.name || "",
          images: t.album?.images || [],
        },
        duration_ms: t.duration_ms || 0,
        explicit: t.explicit || false,
        popularity: t.popularity || 0,
        name: t.name || "Unknown Track",
      };
      await Titre.updateOne(
        { spotifyId: t.id },
        { $set: trackData },
        { upsert: true }
      );
    }

    // Récupère tous les IDs d'artistes uniques des tracks
    const artistIds = [
      ...new Set(
        tracks
          .map((track) => track.track?.artists?.map((a) => a.id))
          .flat()
          .filter(Boolean)
      ),
    ];
    const artists = await getSpotifyArtists(artistIds, market);
    for (const artist of artists) {
      if (!artist) continue;
      const artistData = {
        spotifyId: artist.id,
        name: artist.name,
        genres: artist.genres,
        image: artist.images?.[0]?.url || "",
        followers: artist.followers?.total || 0,
        popularity: artist.popularity || 0,
        uri: artist.uri,
      };
      await Artiste.updateOne(
        { spotifyId: artist.id },
        { $set: artistData },
        { upsert: true }
      );
    }
    // Récupère tous les IDs d'albums uniques des tracks
    const albumIds = [
      ...new Set(tracks.map((track) => track.track?.album?.id).filter(Boolean)),
    ];
    const albums = await getSpotifyAlbums(albumIds, market);
    for (const album of albums) {
      if (!album) continue;
      const albumData = {
        spotifyId: album.id,
        name: album.name,
        artists: album.artists?.map((a) => a.name) || [],
        release_date: album.release_date,
        image: album.images?.[0]?.url || "",
        total_tracks: album.total_tracks,
        album_type: album.album_type,
        uri: album.uri,
      };
      await Album.updateOne(
        { spotifyId: album.id },
        { $set: albumData },
        { upsert: true }
      );
    }

    const playlists = await getSpotifyPlaylists([playlistId], market);
    for (const playlist of playlists) {
      if (!playlist) continue;
      const playlistData = {
        spotifyId: playlist.id,
        name: playlist.name,
        description: playlist.description || "",
        owner: playlist.owner?.display_name || "",
        tracks:
          playlist.tracks?.items
            ?.map((item) => item.track?.id)
            .filter(Boolean) || [],
        image: playlist.images?.[0]?.url || "",
        public: playlist.public,
        collaborative: playlist.collaborative,
        uri: playlist.uri,
      };
      await Playlist.updateOne(
        { spotifyId: playlist.id },
        { $set: playlistData },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("❌ Sync failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

syncAll();
