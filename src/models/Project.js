import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: ["single", "ep", "album", "mixtape"],
    },
    collaborators: [
      {
        type: String,
        trim: true,
      },
    ],
    audioUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    artistId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    streams: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
projectSchema.index({ artistId: 1, createdAt: -1 });
projectSchema.index({ status: 1 });
projectSchema.index({ projectType: 1 });

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
