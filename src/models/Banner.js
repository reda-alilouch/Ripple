import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: Object, required: true },
  description: { type: Object, required: true },
  image: { type: String, required: true }, // URL de l'image
});

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
