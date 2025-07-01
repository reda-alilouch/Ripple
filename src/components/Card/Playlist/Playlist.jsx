import React from "react";
import PropTypes from "prop-types";

const Playlist = ({ playlist, className = "" }) => {
  // Sécurité : fallback si playlist absent
  if (!playlist) return null;
  return (
    <div
      className={`group relative w-full max-w-[200px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer aspect-square ${className}`}
    >
      {/* Image principale */}
      <img
        src={playlist.image || "/default-playlist.svg"}
        alt={`Pochette de ${playlist.name}`}
        className="w-full h-full object-cover rounded-md"
        onError={(e) => {
          console.warn(
            `Erreur de chargement de l'image pour ${playlist.name}:`,
            playlist.image
          );
          e.target.onerror = null;
          e.target.src = "/default-playlist.svg";
        }}
        onLoad={() => {
          console.log(
            `Image chargée avec succès pour ${playlist.name}:`,
            playlist.image
          );
        }}
      />

      {/* Overlay flou en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-lg truncate mb-1">
            {playlist.name}
          </h3>

          <div className="flex items-center justify-between text-white text-sm">
            <span className="font-medium">titres</span>
            {/* Ajoute d'autres infos si besoin */}
          </div>
        </div>
      </div>

      {/* Bouton play */}
      <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#ff4545] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#ff3030] shadow-lg z-20">
        <span className="text-white text-xl">▶</span>
      </button>
    </div>
  );
};

export default Playlist;

// Props par défaut pour le composant
Playlist.defaultProps = {
  title: "Ma Playlist",
  description: "",
  imageUrl: "https://via.placeholder.com/300",
  trackCount: 0,
  duration: null,
};

// Définition des types des props
Playlist.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  trackCount: PropTypes.number,
  duration: PropTypes.number,
};
