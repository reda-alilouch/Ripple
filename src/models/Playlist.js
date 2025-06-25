import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  spotifyId: { type: String, unique: true },
  name: String,
  description: String,
  owner: String,
  tracks: [String], // IDs des titres
  image: String,
  // Ajoute d'autres champs selon la structure Spotify si besoin
});

export default mongoose.models.Playlist ||
  mongoose.model("Playlist", PlaylistSchema);
