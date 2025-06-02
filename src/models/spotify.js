import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  artists: [
    {
      id: String,
      name: String,
    },
  ],
  album: {
    id: String,
    name: String,
    images: [
      {
        url: String,
        height: Number,
        width: Number,
      },
    ],
  },
  duration_ms: Number,
  popularity: Number,
  preview_url: String,
  external_urls: {
    spotify: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

const artistSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  images: [
    {
      url: String,
      height: Number,
      width: Number,
    },
  ],
  genres: [String],
  popularity: Number,
  external_urls: {
    spotify: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

const playlistSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  images: [
    {
      url: String,
      height: Number,
      width: Number,
    },
  ],
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  owner: {
    id: String,
    name: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

const albumSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  artists: [
    {
      id: String,
      name: String,
    },
  ],
  images: [
    {
      url: String,
      height: Number,
      width: Number,
    },
  ],
  release_date: String,
  total_tracks: Number,
  type: String,
  genres: [String],
  popularity: Number,
  external_urls: {
    spotify: String,
  },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  updatedAt: { type: Date, default: Date.now },
});

export const Track =
  mongoose.models.Track || mongoose.model("Track", trackSchema);
export const Artist =
  mongoose.models.Artist || mongoose.model("Artist", artistSchema);
export const Playlist =
  mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);
export const Album =
  mongoose.models.Album || mongoose.model("Album", albumSchema);
