"use client";
import { useEffect, useState } from "react";
import Album from "@/components/Card/Album/Album";
import { useTranslation } from "react-i18next";

export default function ListAlbum() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation("common");
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/albums");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des albums");
        }

        const data = await response.json();
        console.log("Données albums reçues:", data);

        if (data.albums && Array.isArray(data.albums)) {
          setAlbums(data.albums);
        } else {
          console.warn("Format de données inattendu pour les albums:", data);
          setAlbums([]);
        }
      } catch (err) {
        console.error("Erreur chargement albums:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (isLoading) {
    return (
      <section className="section container px-5 pt-5">
        <div className="head flex justify-between items-center">
          <h2 className="top font-bold">{t("topAlbums")}</h2>
        </div>
        <div className="flex justify-center mt-5">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section container px-5 pt-5">
        <div className="head flex justify-between items-center">
          <h2 className="top font-bold">{t("topAlbums")}</h2>
        </div>
        <div className="text-red-500 mt-5">
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
    <section className="section container px-5 pt-5">
      <div className="head flex justify-between items-center">
        <h2 className="top font-bold">{t("topAlbums")}</h2>
        <div className="voir-plus flex">
          <a
            href="/Albums"
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <span>{t("voirPlus")}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5 md:grid-cols-3 lg:grid-cols-4">
        {albums.length === 0 ? (
          <p className="px-5 text-gray-500">Aucun album trouvé.</p>
        ) : (
          albums.map((album, index) => {
            let classNamealbum = "";

            // On cache le 4e album (index 3) sur les écrans de taille moyenne (md)
            if (index < 2) {
              classNamealbum = "";
            } else if (index >= 3) {
              classNamealbum = "block md:hidden lg:block";
            }
            return (
              <Album album={album} key={album.id} className={classNamealbum} />
            );
          })
        )}
      </div>
    </section>
  );
}
