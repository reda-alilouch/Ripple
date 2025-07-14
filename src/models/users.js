import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return this.provider === "credentials";
    },
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
  googleId: {
    type: String,
    sparse: true,
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index pour optimiser les requêtes
userSchema.index({ email: 1, provider: 1 });
userSchema.index({ googleId: 1 });

// Middleware pour mettre à jour updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthode pour exclure le mot de passe
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.models.User || mongoose.model("User", userSchema);