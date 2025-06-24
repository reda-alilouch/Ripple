import mongoose from "mongoose";

const TitreSchema = new mongoose.Schema({
  spotifyId: { type: String, unique: true },
  name: String,
  artists: [String],
  album: String,
  image: String,
  duration: Number,
  previewUrl: String,
  // Ajoute d'autres champs selon la structure Spotify si besoin
});

export default mongoose.models.Titre || mongoose.model("Titre", TitreSchema);
