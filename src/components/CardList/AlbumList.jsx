"use client";
import { useEffect, useState } from "react";
import Album from "@/src/components/Card/Album/Album";

export default function ListAlbum() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("/api/spotify/user-data")
      .then(async (res) => {
        const text = await res.text();
        if (!text) throw new Error("❌ Réponse vide de l'API");
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("🎧 Albums reçus:", data);

        if (Array.isArray(data.albums)) {
          setAlbums(data.albums.slice(0, 4));
        } else {
          console.error("❌ Les albums ne sont pas un tableau :", data.albums);
        }
      })
      .catch((err) => console.error("Erreur chargement albums:", err));
  }, []);

  return (
    <section className="section container px-5 pt-5">
      <div className="head flex justify-between items-center">
        <h2 className="top font-bold">Top albums</h2>
        <div className="voir-plus flex">
          <a href="#">
            <span className="voir">voir plus</span>
            <i className="fa-solid fa-arrow-right arrow-rotation"></i>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5 md:grid-cols-3 lg:grid-cols-4">
        {albums.length === 0 && <p className="px-5">Aucun album trouvé.</p>}

        {albums.map((album, index) => {
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
        })}
      </div>
    </section>
  );
}
