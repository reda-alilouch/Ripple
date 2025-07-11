import mongoose from "mongoose";
import Artiste from "../models/Artiste.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function cleanArtistes() {
  await mongoose.connect(process.env.MONGODB_URI);

  const all = await Artiste.find({}).lean();
  const seen = new Set();
  let deleted = 0;

  for (const artist of all) {
    if (artist.spotifyId && seen.has(artist.spotifyId)) {
      await Artiste.deleteOne({ _id: artist._id });
      deleted++;
    } else if (artist.spotifyId) {
      seen.add(artist.spotifyId);
    }
  }

  await mongoose.disconnect();
}

cleanArtistes();
