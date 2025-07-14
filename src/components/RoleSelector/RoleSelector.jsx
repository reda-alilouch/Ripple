"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Icon from "@/components/Icon";
import styles from "./RoleSelector.module.css";

const RoleSelector = ({ onRoleSelected, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Données pour le formulaire artiste
  const [artistData, setArtistData] = useState({
    stageName: "",
    bio: "",
    genres: [],
    socialLinks: [], // tableau de liens { type: '', url: '' }
  });

  // Données pour le formulaire auditeur
  const [listenerData, setListenerData] = useState({
    favoriteGenres: [],
  });

  const availableGenres = [
    "Pop",
    "Rock",
    "Hip-Hop",
    "R&B",
    "Jazz",
    "Classical",
    "Electronic",
    "Country",
    "Folk",
    "Blues",
    "Reggae",
    "Latin",
    "Metal",
    "Punk",
    "Indie",
    "Alternative",
    "Dance",
    "House",
    "Techno",
    "Ambient",
  ];

  // Liste des types de liens possibles
  const linkTypes = [
    { value: "spotify", label: "Spotify" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "youtube", label: "YouTube" },
    { value: "site", label: "Site web" },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError("");
  };

  const handleGenreToggle = (genre, isArtist = true) => {
    if (isArtist) {
      setArtistData((prev) => ({
        ...prev,
        genres: prev.genres.includes(genre)
          ? prev.genres.filter((g) => g !== genre)
          : [...prev.genres, genre],
      }));
    } else {
      setListenerData((prev) => ({
        ...prev,
        favoriteGenres: prev.favoriteGenres.includes(genre)
          ? prev.favoriteGenres.filter((g) => g !== genre)
          : [...prev.favoriteGenres, genre],
      }));
    }
  };

  // Fonction pour ajouter un champ lien
  const handleAddLink = () => {
    setArtistData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { type: "spotify", url: "" }],
    }));
  };

  // Fonction pour modifier un lien
  const handleLinkChange = (index, field, value) => {
    setArtistData((prev) => {
      const links = [...prev.socialLinks];
      links[index][field] = value;
      return { ...prev, socialLinks: links };
    });
  };

  // Fonction pour supprimer un lien
  const handleRemoveLink = (index) => {
    setArtistData((prev) => {
      const links = [...prev.socialLinks];
      links.splice(index, 1);
      return { ...prev, socialLinks: links };
    });
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError("Veuillez sélectionner un rôle");
      return;
    }

    if (selectedRole === "artist") {
      if (!artistData.stageName.trim()) {
        setError("Le nom de scène est requis");
        return;
      }
      if (artistData.genres.length === 0) {
        setError("Veuillez sélectionner au moins un genre");
        return;
      }
    }

    setIsSubmitting(true);
    setError("");

    // Adapter socialLinks (tableau) en objet pour l'API
    let profileDataToSend = { ...artistData };
    if (selectedRole === "artist") {
      profileDataToSend = {
        ...artistData,
        socialLinks: artistData.socialLinks.reduce((acc, link) => {
          if (link.url && link.url.trim() !== "") {
            acc[link.type] = link.url.trim();
          }
          return acc;
        }, {}),
      };
    }

    try {
      const response = await axios.post("/api/user/role", {
        role: selectedRole,
        profileData:
          selectedRole === "artist" ? profileDataToSend : listenerData,
      });
      const data = response.data;

      if (data.success) {
        onRoleSelected(selectedRole);
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ajout d'un effet pour bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/90 backdrop-blur-sm p-2">
      <div className="w-full max-w-xl bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl overflow-auto max-h-screen animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Choisissez votre rôle
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            <Icon
              lib="fa-solid"
              name="fa-times"
              className="text-gray-500 dark:text-gray-300"
            />
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-3 border-b border-red-200 dark:border-red-700 text-sm">
            <Icon lib="fa-solid" name="fa-exclamation-triangle" />
            {error}
          </div>
        )}

        {/* Choix du rôle */}
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {/* Auditeur */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === "listener"
                  ? "border-[#ff4545] bg-[#fff5f5] dark:bg-[#2a1818] shadow-lg"
                  : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#18181b] hover:border-[#ff4545]/60"
              }`}
              onClick={() => handleRoleSelect("listener")}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ff4545] text-white text-2xl">
                <Icon lib="fa-solid" name="fa-headphones" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  Auditeur
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  Écoutez de la musique, créez des playlists, suivez vos
                  artistes préférés
                </p>
              </div>
            </div>
            {/* Artiste */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === "artist"
                  ? "border-[#ff4545] bg-[#fff5f5] dark:bg-[#2a1818] shadow-lg"
                  : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#18181b] hover:border-[#ff4545]/60"
              }`}
              onClick={() => handleRoleSelect("artist")}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ff4545] text-white text-2xl">
                <Icon lib="fa-solid" name="fa-microphone" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  Artiste
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  Publiez votre musique, gérez vos albums et connectez-vous avec
                  votre audience
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire artiste */}
          {selectedRole === "artist" && (
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Nom de scène *
                </label>
                <input
                  type="text"
                  value={artistData.stageName}
                  onChange={(e) =>
                    setArtistData((prev) => ({
                      ...prev,
                      stageName: e.target.value,
                    }))
                  }
                  placeholder="Votre nom de scène"
                  className="w-full px-4 py-2 rounded border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff4545]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Biographie
                </label>
                <textarea
                  value={artistData.bio}
                  onChange={(e) =>
                    setArtistData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Parlez-nous de votre musique..."
                  className="w-full px-4 py-2 rounded border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff4545] min-h-[80px]"
                  rows="3"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Genres musicaux *
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all ${
                        artistData.genres.includes(genre)
                          ? "bg-[#ff4545] border-[#ff4545] text-white shadow"
                          : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-[#ff4545] hover:text-[#ff4545]"
                      }`}
                      onClick={() => handleGenreToggle(genre, true)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Liens sociaux (optionnel)
                </label>
                {artistData.socialLinks.length > 0 && (
                  <div className="flex flex-col gap-2 mb-2">
                    {artistData.socialLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={link.type}
                          onChange={(e) =>
                            handleLinkChange(idx, "type", e.target.value)
                          }
                          className="px-3 py-2 rounded border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff4545]"
                        >
                          {linkTypes.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="url"
                          placeholder={`Lien ${
                            linkTypes.find((t) => t.value === link.type)
                              ?.label || "Social"
                          }`}
                          value={link.url}
                          onChange={(e) =>
                            handleLinkChange(idx, "url", e.target.value)
                          }
                          className="flex-1 px-4 py-2 rounded border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#ff4545]"
                        />
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700 text-[#ff4545] hover:bg-[#ff4545] hover:text-white transition"
                          onClick={() => handleRemoveLink(idx)}
                          title="Supprimer ce lien"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-[#ff4545] text-white font-semibold hover:bg-[#ff6666] transition"
                  onClick={handleAddLink}
                >
                  + Ajouter un lien
                </button>
              </div>
            </div>
          )}

          {/* Formulaire auditeur */}
          {selectedRole === "listener" && (
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Genres préférés
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all ${
                        listenerData.favoriteGenres.includes(genre)
                          ? "bg-[#ff4545] border-[#ff4545] text-white shadow"
                          : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-[#ff4545] hover:text-[#ff4545]"
                      }`}
                      onClick={() => handleGenreToggle(genre, false)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedRole}
            className="flex-1 px-4 py-2 rounded bg-[#ff4545] text-white font-semibold hover:bg-[#ff6666] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Icon
                  lib="fa-solid"
                  name="fa-spinner"
                  className="animate-spin"
                />
                Création...
              </>
            ) : (
              "Créer mon profil"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
