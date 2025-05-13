import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  genres: [String],
  image: String,
});

export default mongoose.models.Artist || mongoose.model("Artist", ArtistSchema);
