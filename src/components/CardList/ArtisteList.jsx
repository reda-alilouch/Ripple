"use client";
import React, { useEffect, useState } from "react";
import Artiste from "../Card/Artiste/Artiste";
import { useTranslation } from "react-i18next";

export default function ListArtiste() {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchArtistes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/artistes");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des artistes");
        }

        const data = await response.json();

        if (data.artists && Array.isArray(data.artists)) {
          setArtists(data.artists);
        } else {
          // console.warn("Format de données inattendu pour les artistes:", data);
          setArtists([]);
        }
      } catch (err) {
        // console.error("❌ Erreur fetch artistes:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistes();
  }, []);

  if (isLoading) {
    return (
      <section className="section container px-5 pt-5 pb-5">
        <div className="head flex justify-between items-center mb-5">
          <h2 className="top font-bold">{t("topArtists")}</h2>
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
          <h2 className="top font-bold">{t("topArtists")}</h2>
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
        <h2 className="top font-bold">{t("topArtists")}</h2>
        <div className="voir-plus">
          <a
            href="/Artistes"
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <span>{t("voirPlus")}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
      <div id="cards-container" className="flex flex-wrap justify-center gap-7">
        {artists.length === 0 ? (
          <p className="px-5 text-gray-500">Aucun artiste trouvé.</p>
        ) : (
          artists.map((artist, index) => {
            let className = "";

            if (index < 4) {
              className = ""; // visible partout
            } else if (index >= 4 && index < 6) {
              className = "hidden sm:block"; // visible à partir de sm (≥ 640px)
            } else if (index >= 6 && index < 8) {
              className = "hidden lg:block"; // visible à partir de lg (≥ 1024px)
            }

            return (
              <Artiste key={artist.id} artist={artist} className={className} />
            );
          })
        )}
      </div>
    </section>
  );
}
