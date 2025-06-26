"use client";
import React, { useEffect, useState } from "react";
import Artiste from "../Card/Artiste/Artiste";

export default function ListArtiste() {
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    fetch("/api/spotify/user-data")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.artists)) {
          setArtists(data.artists.slice(0, 8));
        } 
      })
      .catch((err) => console.error("❌ Erreur fetch artistes:", err));
  }, []);

  return (
    <section className="section container px-5 pt-5 pb-5">
      <div className="head flex justify-between items-center mb-5">
        <h2 className="top font-bold">Top artistes</h2>
        <div className="voir-plus">
          <a
            href="/Artistes"
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <span>Voir plus</span>
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
      <div id="cards-container" className="flex flex-wrap justify-center gap-7">
        {artists.length === 0 && <p className="px-5">Aucun artiste trouvé.</p>}

        {artists.map((artist, index) => {
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
        })}
      </div>
    </section>
  );
}
