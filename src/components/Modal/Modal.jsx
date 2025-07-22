"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AuthModal({ isOpen, closeModal }) {
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
        // Inscription avec validation côté client
        if (!form.name.trim()) {
          setError("Le nom est requis");
          setIsLoading(false);
          return;
        }

        if (!form.email.trim()) {
          setError("L'email est requis");
          setIsLoading(false);
          return;
        }

        if (form.password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères");
          setIsLoading(false);
          return;
        }

        const res = await axios.post("/api/auth/signup", {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        if (res.data.success) {
          // Connexion automatique après inscription
          const signInResult = await signIn("credentials", {
            email: form.email.trim(),
            password: form.password,
            redirect: false,
          });

          if (signInResult?.error) {
            setError("Inscription réussie, mais erreur lors de la connexion");
          } else {
            router.refresh();
            closeModal();
          }
        }
      } else {
        // Connexion
        if (!form.email.trim() || !form.password) {
          setError("Email et mot de passe sont requis");
          setIsLoading(false);
          return;
        }

        const result = await signIn("credentials", {
          email: form.email.trim(),
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
      const errorMessage =
        err.response?.data?.error || err.message || "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Erreur lors de la connexion avec Google");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "" });
    setError("");
    setShowPassword(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80">
      <div className="relative p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl w-[420px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {/* Bouton de fermeture */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          disabled={isLoading}
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        <h2 className="mb-6 text-2xl font-bold text-center">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </h2>

        {/* Bouton Google */}
        <div className="mb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuer avec Google
          </button>
        </div>

        {/* Séparateur */}
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

        {/* Formulaire */}
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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

        {/* Basculer entre connexion et inscription */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <button
            onClick={toggleMode}
            disabled={isLoading}
            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSignUp ? "Se connecter" : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}
