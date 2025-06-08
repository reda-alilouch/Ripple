import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis"],
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "credentials";
    },
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Mettre à jour la date de modification avant la sauvegarde
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Vérifier si le modèle existe déjà pour éviter l'erreur "Cannot overwrite model"
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
