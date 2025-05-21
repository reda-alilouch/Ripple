"use client";
import { useEffect, useState } from "react";
import Album from "@/src/components/Card/Album/Album";

import { useEffect, useState } from "react";
import Album from "@/src/components/Card/Album/Album";

export default function ListAlbum() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("/api/spotify/search")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA BRUTE:", data);
        if (Array.isArray(data.albums)) {
          setAlbums(data.albums.slice(0, 4)); // On récupère jusqu'à 4 albums
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

          if (index === 3) {
          const =  className = "block md:hidden lg:block"; // ❌ cachée sur md, ✅ visible sur autres tailles
          }

          return (
            <div key={album.id} className={className}>
              <Album album={album} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
