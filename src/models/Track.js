import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  album: String,
  artists: [String],
  duration_ms: Number,
  preview_url: String,
});

export default mongoose.models.Track || mongoose.model("Track", TrackSchema);
