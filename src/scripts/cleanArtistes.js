import mongoose from "mongoose";
import Artiste from "../models/Artiste.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function cleanArtistes() {
  console.log("Script lancé");
  await mongoose.connect(process.env.MONGODB_URI);

  const all = await Artiste.find({}).lean();
  console.log(`Nombre total d'artistes : ${all.length}`);
  const seen = new Set();
  let deleted = 0;

  for (const artist of all) {
    if (artist.spotifyId && seen.has(artist.spotifyId)) {
      await Artiste.deleteOne({ _id: artist._id });
      deleted++;
      console.log(`Supprimé : ${artist.name} (${artist.spotifyId})`);
    } else if (artist.spotifyId) {
      seen.add(artist.spotifyId);
    }
  }

  console.log(`Doublons supprimés : ${deleted}`);
  await mongoose.disconnect();
}

cleanArtistes();
