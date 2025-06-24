import mongoose from "mongoose";

const ArtisteSchema = new mongoose.Schema({
  spotifyId: { type: String, unique: true },
  name: String,
  genres: [String],
  image: String,
  // Ajoute d'autres champs selon la structure Spotify si besoin
});

export default mongoose.models.Artiste ||
  mongoose.model("Artiste", ArtisteSchema);
