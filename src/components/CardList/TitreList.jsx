"use client";
import { useEffect, useState } from "react";
import Titre from "@/src/components/Card/Titre/Titre"; // Corrige ce chemin si besoin
export default function ListTrack() {
  const [tracks, setTracks] = useState([]);
useEffect(() => {
  fetch("/api/spotify/user-data")
    .then(async (res) => {
      console.log("📡 Réponse brute:", res);

      const text = await res.text();
      if (!text) {
        throw new Error("❌ Réponse vide de l’API Spotify");
      }

      return JSON.parse(text);
    })
    .then((data) => {
      console.log("📦 Données JSON reçues:", data);
      if (data.tracks) {
        const topTracks = data.tracks.slice(0, 9);
        setTracks(topTracks);
      } else {
        console.warn("⚠️ Données reçues sans champs 'tracks'");
      }
    })
    .catch((err) => {
      console.error("❌ Erreur API:", err);
    });
}, []);

  return (
    <section className="section container">
      <div className="head pt-5 px-5">
        <h2 className="top font-bold">Top titres</h2>
      </div>
      <div className="song-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tracks.length === 0 && <p className="px-5">Aucun titre trouvé.</p>}
        {tracks.map((track, index) => {
          let className = "";
          if (index < 4) {
            className = "";
          } else if (index >= 3 && index < 6) {
            className = "hidden sm:block";
          } else if (index >= 6 && index < 9) {
            className = "hidden sm:hidden md:hidden lg:block";
          }
          return <Titre key={track.id} track={track} className={className} />;
        })}
      </div>
    </section>
  );
}
