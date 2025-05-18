// models/track.js
import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  album: { type: String, required: true },
  artists: [{ type: String, required: true }],
  duration_ms: { type: Number, required: true },
  preview_url: { type: String, required: true },
});

export default mongoose.models.Track || mongoose.model("Track", TrackSchema);
