import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  description: String,
  image: String,
  tracks: [String],
});

export default mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);

