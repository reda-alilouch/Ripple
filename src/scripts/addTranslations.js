// Script pour ajouter des traductions de base
import connectMongoDB from "../lib/mongodb.js";
import Translation from "../models/Translation.js";

const baseTranslations = [
  // Navigation
  {
    namespace: "common",
    key: "home",
    values: { fr: "Accueil", en: "Home" },
  },
  {
    namespace: "common",
    key: "search",
    values: { fr: "Rechercher", en: "Search" },
  },
  {
    namespace: "common",
    key: "profile",
    values: { fr: "Profil", en: "Profile" },
  },
  {
    namespace: "common",
    key: "artists",
    values: { fr: "Artistes", en: "Artists" },
  },
  {
    namespace: "common",
    key: "albums",
    values: { fr: "Albums", en: "Albums" },
  },
  {
    namespace: "common",
    key: "playlists",
    values: { fr: "Playlists", en: "Playlists" },
  },
  {
    namespace: "common",
    key: "tracks",
    values: { fr: "Titres", en: "Tracks" },
  },

  // Authentification
  {
    namespace: "auth",
    key: "signin",
    values: { fr: "Se connecter", en: "Sign in" },
  },
  {
    namespace: "auth",
    key: "signup",
    values: { fr: "S'inscrire", en: "Sign up" },
  },
  {
    namespace: "auth",
    key: "signout",
    values: { fr: "Se déconnecter", en: "Sign out" },
  },
  {
    namespace: "auth",
    key: "email",
    values: { fr: "Email", en: "Email" },
  },
  {
    namespace: "auth",
    key: "password",
    values: { fr: "Mot de passe", en: "Password" },
  },
  {
    namespace: "auth",
    key: "name",
    values: { fr: "Nom complet", en: "Full name" },
  },
  {
    namespace: "auth",
    key: "continueWithGoogle",
    values: { fr: "Continuer avec Google", en: "Continue with Google" },
  },

  // Messages
  {
    namespace: "messages",
    key: "loading",
    values: { fr: "Chargement...", en: "Loading..." },
  },
  {
    namespace: "messages",
    key: "error",
    values: { fr: "Erreur", en: "Error" },
  },
  {
    namespace: "messages",
    key: "success",
    values: { fr: "Succès", en: "Success" },
  },
  {
    namespace: "messages",
    key: "incorrectCredentials",
    values: {
      fr: "Email ou mot de passe incorrect",
      en: "Incorrect email or password",
    },
  },
  {
    namespace: "messages",
    key: "registrationSuccess",
    values: { fr: "Inscription réussie !", en: "Registration successful!" },
  },

  // Footer
  {
    namespace: "footer",
    key: "aboutUs",
    values: { fr: "À propos de nous", en: "About Us" },
  },
  {
    namespace: "footer",
    key: "socialMedia",
    values: { fr: "Réseaux sociaux", en: "Social Media" },
  },
  {
    namespace: "footer",
    key: "contact",
    values: { fr: "Contact", en: "Contact" },
  },
];

async function addTranslations() {
  try {
    await connectMongoDB();
    console.log("Connexion à MongoDB établie");

    for (const translation of baseTranslations) {
      try {
        await Translation.findOneAndUpdate(
          { namespace: translation.namespace, key: translation.key },
          translation,
          { upsert: true, new: true }
        );
        console.log(
          `✅ Traduction ajoutée: ${translation.namespace}.${translation.key}`
        );
      } catch (error) {
        console.error(
          `❌ Erreur pour ${translation.namespace}.${translation.key}:`,
          error.message
        );
      }
    }

    console.log("🎉 Toutes les traductions ont été ajoutées avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des traductions:", error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  addTranslations();
}

export default addTranslations;
