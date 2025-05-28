"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Modal({ isOpen, closeModal }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // ✅ ajouté ici

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    // Vérifier le type de contenu pour éviter l'erreur JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Réponse du serveur invalide (pas JSON)");
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Une erreur est survenue");
    }

    alert("✅ Succès !");
    closeModal();
  } catch (error) {
    alert("❌ Erreur : " + error.message);
    console.error("Erreur lors de la soumission :", error);
  }
};


  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative p-6 bg-white shadow-lg dark:bg-gray-900 rounded-xl w-96">
          <button className="absolute top-2 right-2" onClick={closeModal}>
            ✖
          </button>
          <h2 className="mb-4 text-lg font-bold">
            {isSignUp ? "Créer un compte" : "Connexion"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <input
                type="text"
                name="name"
                placeholder="Nom"
                className="p-2 border rounded dark:bg-slate-900 text-slate-950 dark:placeholder-white dark:hover:shadow-customdark"
                onChange={handleChange}
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-2 border rounded dark:bg-slate-900 text-slate-950 dark:placeholder-white dark:hover:shadow-customdark"
              onChange={handleChange}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="Mot de passe"
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded dark:bg-slate-900 text-slate-950 dark:placeholder-white dark:text-white dark:hover:shadow-customdark"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute text-black right-3 top-2 dark:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="py-2 text-white bg-blue-600 rounded hover:bg-blue-700 "
            >
              {isSignUp ? "S'inscrire" : "Se connecter"}
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            {isSignUp ? "Déjà un compte ?" : "Nouveau ici ?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 underline"
            >
              {isSignUp ? "Connexion" : "Créer un compte"}
            </button>
          </p>
        </div>
      </div>
    )
  );
}
