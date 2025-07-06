import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: ["listener", "artist"],
      default: "listener",
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    bannerImage: {
      type: String,
      default: null,
    },
    // Champs communs
    stats: {
      totalEcoutes: {
        type: Number,
        default: 0,
      },
      heuresEcoutees: {
        type: Number,
        default: 0,
      },
      artistesDecouverts: {
        type: Number,
        default: 0,
      },
      playlistsCreees: {
        type: Number,
        default: 0,
      },
    },
    // Champs spécifiques artiste
    artistProfile: {
      stageName: String,
      bio: String,
      genres: [String],
      socialLinks: {
        type: Object,
        default: {},
      },
      verified: {
        type: Boolean,
        default: false,
      },
      monthlyListeners: {
        type: Number,
        default: 0,
      },
      totalStreams: {
        type: Number,
        default: 0,
      },
      albums: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Album",
        },
      ],
      tracks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Titre",
        },
      ],
    },
    // Champs spécifiques auditeur
    listenerProfile: {
      favoriteGenres: [String],
      recentlyPlayed: [
        {
          track: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Titre",
          },
          playedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

// Supprime le mot de passe lors de la sérialisation
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Méthode pour vérifier si l'utilisateur est un artiste
userSchema.methods.isArtist = function () {
  return this.role === "artist";
};

// Méthode pour vérifier si l'utilisateur est un auditeur
userSchema.methods.isListener = function () {
  return this.role === "listener";
};

export default mongoose.models.User || mongoose.model("User", userSchema);
