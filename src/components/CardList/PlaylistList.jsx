"use client";
import { useEffect, useState } from "react";
import Playlist from "@/components/Card/Playlist/Playlist";
import { useTranslation } from "react-i18next";
const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation("common");
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/playlists");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des playlists");
        }

        const data = await response.json();

        if (data.playlists && Array.isArray(data.playlists)) {
          setPlaylists(data.playlists);
        } else {
          setPlaylists([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <section className="section container px-5 pt-5 pb-5">
        <div className="head flex justify-between items-center mb-5">
          <h2 className="top font-bold text-2xl">{t("topPlaylists")}</h2>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section container px-5 pt-5 pb-5">
        <div className="head flex justify-between items-center mb-5">
          <h2 className="top font-bold text-2xl">{t("topPlaylists")}</h2>
        </div>
        <div className="text-red-500">
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
    <section className="section container px-5 pt-5 pb-5">
      <div className="head flex justify-between items-center mb-5">
        <h2 className="top font-bold text-2xl">{t("topPlaylists")}</h2>
        <div className="voir-plus">
          <a
            href="/Playlistes"
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <span>{t("voirPlus")}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
      <div
        id="cards-container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {playlists.length === 0 ? (
          <p className="px-5 text-gray-500">Aucune playlist trouvée.</p>
        ) : (
          playlists.map((playlist) => (
            <Playlist key={playlist.id} playlist={playlist} />
          ))
        )}
      </div>
    </section>
  );
};

export default PlaylistList;
