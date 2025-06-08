"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Fonction pour logger les actions
const logAction = (action, details) => {
  console.log(`[Modal] ${action}:`, details);
};

// Fonction pour gérer les erreurs
const handleError = (error, context) => {
  console.error(`[Modal Error - ${context}]:`, error);
  return (
    error.response?.data?.error || error.message || "Une erreur est survenue"
  );
};

// Fonction pour se connecter à MongoDB
const ensureMongoConnection = async () => {
  try {
    await connectMongoDB();
    logAction("MongoDB Connection", "Successfully connected");
    return true;
  } catch (error) {
    console.error("[MongoDB Connection Error]:", error);
    return false;
  }
};

export default function Modal({ isOpen, closeModal }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Effacer l'erreur quand l'utilisateur modifie un champ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Inscription
        const res = await axios.post("/api/auth/signup", form);
        if (res.data.success) {
          // Si l'inscription réussit, connecter automatiquement
          const signInResult = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
          });

          if (signInResult?.error) {
            setError(
              "Inscription réussie, mais erreur lors de la connexion automatique"
            );
          } else {
            router.refresh();
            closeModal();
          }
        }
      } else {
        // Connexion
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Email ou mot de passe incorrect");
        } else {
          router.refresh();
          closeModal();
        }
      }
    } catch (err) {
      setError(handleError(err, isSignUp ? "signup" : "signin"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/profil" });
    } catch (err) {
      setError("Erreur lors de la connexion avec Google");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80">
      <div className="relative p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl w-[420px]">
        {/* Bouton de fermeture */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        <h2 className="mb-6 text-2xl font-bold text-center">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </h2>

        <div className="space-y-4 mb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fab fa-google text-xl"></i>
            Continuer avec Google
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              ou
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="relative">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom complet"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4545] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}

          <div className="relative">
            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4545] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
              disabled={isLoading}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4545] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 text-white bg-[#FF4545] rounded-lg hover:bg-[#E03E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                Chargement...
              </span>
            ) : isSignUp ? (
              "S'inscrire"
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setForm({ name: "", email: "", password: "" });
            }}
            disabled={isLoading}
            className="ml-1 text-[#FF4545] hover:text-[#E03E3E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignUp ? "Se connecter" : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}
/*
Ce modal gère l'authentification avec le flux suivant :

1. Lors de l'inscription (bouton "S'inscrire") :
   - Les données du formulaire (nom, email, mot de passe) sont envoyées à /api/auth/signup
   - L'API crée un nouvel utilisateur dans MongoDB
   - Si succès : affiche message "✅ Inscription réussie !"
   - Bascule automatiquement vers le formulaire de connexion
   - L'utilisateur doit alors se connecter avec ses identifiants

2. Lors de la connexion :
   - Vérifie les identifiants avec NextAuth
   - Si valides : redirige vers /profil
   - Si invalides : affiche message d'erreur

Le stockage en base de données se fait uniquement à l'inscription.
La connexion ne fait que vérifier les données existantes.

Flux technique inscription -> connexion :
1. POST /api/auth/signup (stockage MongoDB)
2. Retour au formulaire connexion
3. Authentification via NextAuth
4. Redirection profil
*/
