// models/Translation.js
import mongoose from "mongoose";

const translationSchema = new mongoose.Schema(
  {
    namespace: { type: String, required: true },
    key: { type: String, required: true },
    values: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Index pour des recherches plus rapides
translationSchema.index({ namespace: 1, key: 1 }, { unique: true });

export default mongoose.models.Translation ||
  mongoose.model("Translation", translationSchema);
