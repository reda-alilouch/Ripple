"use client";
import { useState } from "react";
import axios from "axios";
import styles from "./Titre.module.css";
import Icon from "@/components/Icon";
import AddTitre from "@/components/AddTitre/AddTitre";

// Fonction utilitaire pour formater la durée en millisecondes en MM:SS
const formatDuration = (ms) => {
  if (!ms) return "--:--";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const Titre = ({ track, className = "", playlistId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Vérifier que la piste est valide
  if (!track || !track.id || !track.name) {
    return null;
  }

  const handlePlay = async (e) => {
    e.preventDefault();

    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (track.preview_url) {
      try {
        // Arrêter tout autre son en cours
        if (audio) {
          audio.pause();
          setAudio(null);
        }

        // Créer un nouvel objet audio
        const newAudio = new Audio(track.preview_url);

        newAudio.onplay = () => setIsPlaying(true);
        newAudio.onended = () => setIsPlaying(false);
        newAudio.onpause = () => setIsPlaying(false);

        setAudio(newAudio);
        await newAudio.play();
      } catch (err) {}
    }
  };

  const handleAddToPlaylist = (e) => {
    e.preventDefault();
    console.log("Ajout à la playlist:", track.name);
    // Ici vous pourriez ajouter la logique pour ajouter à une playlist
  };

  const handleArtistClick = (e) => {
    e.preventDefault();
    // Redirection vers la page de l'artiste si nécessaire
    console.log("Voir l'artiste:", track.artists);
  };

  const handleTrackClick = (e) => {
    e.preventDefault();
    if (track.external_url) {
      window.open(track.external_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`mr-5 mt-5 ms-5 pr-5 w-full ${className}`}>
      <div className={`${styles.titre} titre`}>
        <div className="img-h3 w-full flex items-center">
          <a
            href="#"
            onClick={handlePlay}
            className="relative group"
            title={
              track.preview_url ? "Écouter un extrait" : "Aperçu non disponible"
            }
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                className="img-titre rounded-md object-cover w-full h-full"
                src={track.image || "/default-album.jpg"}
                alt={`Pochette de ${track.name}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-album.jpg";
                }}
                onLoad={() => {
                  setHasError(false);
                }}
              />
              {track.preview_url ? (
                <button
                  onClick={handlePlay}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md transition-opacity ${
                    isPlaying
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label={isPlaying ? "Mettre en pause" : "Lire un extrait"}
                >
                  <Icon
                    lib="fa-solid"
                    name={isPlaying ? "fa-pause" : "fa-play"}
                    className="text-white text-xl"
                  />
                </button>
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Aperçu non disponible"
                >
                  <button
                    className="text-xs text-white bg-gray-500 bg-opacity-80 px-3 py-1 rounded cursor-not-allowed"
                    disabled
                  >
                    Aperçu non disponible
                  </button>
                </div>
              )}
            </div>
          </a>
          <div className="h3 pl-4 flex-1 min-w-0">
            <a
              href="#"
              onClick={handleTrackClick}
              className="block hover:underline truncate"
              title={track.name}
            >
              <h3 className="font-medium truncate">{track.name}</h3>
            </a>
            <div className="text-sm text-gray-500 truncate">
              {Array.isArray(track.artists) && track.artists.length > 0 ? (
                track.artists.map((artist, index, array) => {
                  if (!artist || !artist.name) return null;

                  return (
                    <span key={artist.id || `artist-${index}`}>
                      <a
                        href={`#`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (artist.id) {
                            window.open(
                              `https://open.spotify.com/artist/${artist.id}`,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                        className="hover:underline hover:text-white transition-colors"
                        title={artist.name}
                        onError={() => setHasError(true)}
                      >
                        {artist.name}
                      </a>
                      {index < array.length - 1 ? ", " : ""}
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-400">Artiste inconnu</span>
              )}
            </div>
          </div>
        </div>
        <div className="icon-time flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {formatDuration(track.duration_ms)}
          </span>
          <AddTitre trackId={track._id} playlistId={null} />
        </div>
      </div>
    </div>
  );
};

export default Titre;
