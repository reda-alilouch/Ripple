"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Titre from "@/components/Card/Titre/Titre";
import { useTranslation } from "react-i18next";

export default function ListTrack() {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchTitres = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Utilisation de la nouvelle route API MongoDB
        const response = await axios.get("/api/titres", {
          timeout: 10000, // Timeout de 10 secondes
        });

        const data = response.data;

        // Vérifier si nous avons des pistes dans la réponse
        if (!data.tracks) {
          throw new Error("Aucune donnée de piste disponible");
        }

        // Vérifier que data.tracks est bien un tableau
        if (!Array.isArray(data.tracks)) {
          throw new Error("Format de données incorrect pour les pistes");
        }

        // Traiter chaque piste avec une gestion d'erreur individuelle
        const titres = data.tracks
          .filter((track) => {
            // Vérifier que la piste a un ID et un nom
            const isValid = track && track.id && track.name;
            return isValid;
          })
          .map((track) => {
            try {
              // Les données sont déjà formatées par l'API MongoDB
              return {
                id: track.id,
                _id: track._id,
                name: track.name,
                artists: track.artists || [],
                album: track.album || { name: "Album inconnu", id: null },
                image: track.image || "/default-album.jpg",
                preview_url: track.preview_url || null,
                external_url: track.external_url || "#",
                duration_ms: track.duration_ms || 0,
              };
            } catch (error) {
              return null; // Retourner null pour les pistes en erreur
            }
          })
          .filter(Boolean); // Filtrer les pistes null (en erreur)

        setTracks(titres);
      } catch (err) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Impossible de charger les titres. Veuillez réessayer plus tard.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTitres();
  }, []);

  if (isLoading) {
    return (
      <section className="section container">
        <div className="head pt-5 px-5">
          <h2 className="top font-bold">{t("topTracks")}</h2>
        </div>
        <div className="flex justify-center mt-5">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section container">
        <div className="head pt-5 px-5">
          <h2 className="top font-bold">{t("topTracks")}</h2>
        </div>
        <div className="px-5 text-red-500">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-blue-400 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="head pt-5 px-5">
        <h2 className="top font-bold">{t("topTracks")}</h2>
      </div>
      <div className="song-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tracks.length === 0 ? (
          <div className="px-5 col-span-full text-center py-10">
            <p className="text-gray-400">Aucun titre trouvé.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-400 hover:underline"
            >
              Actualiser
            </button>
          </div>
        ) : (
          tracks.map((track, index) => (
            <Titre
              key={track.id}
              track={track}
              className={
                index >= 3 && index < 6
                  ? "hidden sm:block"
                  : index >= 6
                  ? "hidden sm:hidden md:hidden lg:block"
                  : ""
              }
            />
          ))
        )}
      </div>
    </section>
  );
}
