// src/components/Card/Titre/Titre.jsx
"use client";
import Icon from "@/components/Icon";

const Titre = ({ track, className = "" }) => {
  return (
    <div
      className={`track-card flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg ${className}`}
    >
      <div className="relative w-12 h-12 track-image">
        <img
          src={track?.album?.images?.[0]?.url || "/placeholder-track.jpg"}
          alt={track?.name || "Track cover"}
          className="object-cover w-full h-full rounded"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 play-button hover:opacity-100">
          <Icon lib="fa-solid" name="fa-play" className="text-white" />
        </div>
      </div>
      <div className="flex-1 track-info">
        <h3 className="font-medium track-title">
          {track?.name || "Track Title"}
        </h3>
        <p className="text-sm text-gray-600 track-artist">
          {track?.artists?.[0]?.name || "Artist Name"}
        </p>
      </div>
      <div className="text-sm text-gray-600 track-duration">
        {track?.duration_ms
          ? Math.floor(track.duration_ms / 1000 / 60) +
            ":" +
            String(Math.floor((track.duration_ms / 1000) % 60)).padStart(2, "0")
          : "0:00"}
      </div>
    </div>
  );
};

export default Titre;

const dev = {
  name: "ALILOUCH Reda",
  stack: ["React", "PHP", "MongoDB", "Next.js"],
  strengths: [
    "Résolution de problèmes",
    "Apprentissage rapide",
    "Créativité",
    "Travail en équipe",
  ],
  mission: "Créer des expériences web puissantes",
};
