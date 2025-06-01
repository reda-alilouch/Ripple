"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  return error.response?.data?.message || error.message || "Une erreur est survenue";
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

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      // Inscription
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Réponse invalide du serveur");
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur lors de l'inscription");
        }

        alert("✅ Inscription réussie !");
        setIsSignUp(false); // Revenir à la connexion
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Connexion
      try {
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (res.error) {
          setError("Email ou mot de passe invalide.");
        } else {
          router.replace("/dashboard");
          closeModal();
        }
      } catch (err) {
        setError("Erreur lors de la connexion");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80">
  <div className="p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl w-96">
    <h2 className="mb-4 text-xl font-bold text-center">
      {isSignUp ? "Inscription" : "Connexion"}
    </h2>

    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {isSignUp && (
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom complet"
          required
          className="px-3 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
        />
      )}

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="px-3 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          required
          className="w-full px-3 py-2 pr-10 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute text-gray-500 dark:text-gray-300 right-2 top-2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && (
        <div className="p-2 text-sm text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="py-2 text-white bg-green-600 rounded hover:bg-green-700"
      >
        {isSignUp ? "S'inscrire" : "Se connecter"}
      </button>
    </form>

    <p className="mt-4 text-sm text-center">
      {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-blue-600 dark:text-blue-400 underline"
      >
        {isSignUp ? "Connexion" : "Inscription"}
      </button>
    </p>

    <button
      onClick={closeModal}
      className="block mx-auto mt-4 text-sm text-gray-500 dark:text-gray-300 underline"
    >
      Fermer
    </button>
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
   - Si valides : redirige vers /dashboard
   - Si invalides : affiche message d'erreur

Le stockage en base de données se fait uniquement à l'inscription.
La connexion ne fait que vérifier les données existantes.

Flux technique inscription -> connexion :
1. POST /api/auth/signup (stockage MongoDB)
2. Retour au formulaire connexion
3. Authentification via NextAuth
4. Redirection dashboard
*/








