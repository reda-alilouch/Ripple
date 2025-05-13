import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  release_date: String,
  image: String,
  artists: [String],
});

export default mongoose.models.Album || mongoose.model("Album", AlbumSchema);
