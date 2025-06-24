import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
  spotifyId: { type: String, unique: true },
  name: String,
  artists: [String],
  release_date: String,
  image: String,
  // Ajoute d'autres champs selon la structure Spotify si besoin
});

export default mongoose.models.Album || mongoose.model("Album", AlbumSchema);
