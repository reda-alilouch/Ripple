"use client";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import axios from "axios";
import styles from "./Titre.module.css";
import Icon from "@/components/Icon";
import AddTitre from "@/components/AddTitre/AddTitre";

// Global Audio Player Context
const AudioPlayerContext = createContext();

// Audio Player Provider - Add this to your app root
export const AudioPlayerProvider = ({ children }) => {
  const [globalAudio, setGlobalAudio] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // Format time helper
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Set volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play track function
  const playTrack = async (track) => {
    try {
      if (!track.preview_url) return;
  
      // Stop current
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
  
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
  
      // Check audioRef exists before using it
      if (audioRef.current) {
        audioRef.current.src = track.preview_url;
        await audioRef.current.play();
        setShowPlayer(true);
      } else {
        console.warn("audioRef is not initialized yet.");
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };
  

  // Toggle play/pause
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  // Seek function
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Handle seek click
  const handleSeek = (e) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    if (!volumeRef.current) return;
    
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(percent);
    setIsMuted(false);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Close player
  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowPlayer(false);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    showPlayer,
    playTrack,
    togglePlay,
    seekTo,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    closePlayer,
    formatTime,
    progressRef,
    volumeRef
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}

      <audio ref={audioRef} />

      
      {/* Mini Player */}
      {showPlayer && currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <img 
                src={currentTrack.image || "/default-album.jpg"} 
                alt={currentTrack.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="min-w-0">
                <p className="font-medium text-white truncate">{currentTrack.name}</p>
                <p className="text-gray-400 text-sm truncate">
                  {Array.isArray(currentTrack.artists) 
                    ? currentTrack.artists.map(a => a.name).join(', ')
                    : 'Artiste inconnu'
                  }
                </p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-2 flex-2 max-w-md">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Icon lib="fa-solid" name="fa-pause" className="text-sm" />
                  ) : (
                    <Icon lib="fa-solid" name="fa-play" className="text-sm" />
                  )}
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full flex items-center space-x-2">
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(currentTime)}
                </span>
                <div 
                  ref={progressRef}
                  onClick={handleSeek}
                  className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
                >
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume & Close */}
            <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <Icon lib="fa-solid" name="fa-volume-mute" className="text-sm" />
                  ) : (
                    <Icon lib="fa-solid" name="fa-volume-up" className="text-sm" />
                  )}
                </button>
                <div 
                  ref={volumeRef}
                  onClick={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer"
                >
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
              <button
                onClick={closePlayer}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Icon lib="fa-solid" name="fa-times" className="text-sm" />
              </button>
            </div>
          </div>
          
          {/* Hidden Audio Element */}
        </div>
      )}
    </AudioPlayerContext.Provider>
  );
};

// Custom hook to use audio player
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};

// Fonction utilitaire pour formater la durée en millisecondes en MM:SS
const formatDuration = (ms) => {
  if (!ms) return "--:--";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const Titre = ({ track, className = "", playlistId }) => {
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();
  const [hasError, setHasError] = useState(false);

  // Affichage minimal si track absent ou incomplet
  if (!track || !track.id || !track.name) {
    return (
      <div
        style={{
          color: "red",
          padding: 16,
          background: "#222",
          borderRadius: 8,
        }}
      >
        Composant Titre : données insuffisantes
        <br />
        {JSON.stringify(track)}
      </div>
    );
  }

  // Check if this track is currently playing
  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlay = async (e) => {
    e.preventDefault();
    
    if (track.preview_url) {
      await playTrack(track);
    }
  };

  const handleAddToPlaylist = (e) => {
    e.preventDefault();
    // Ici vous pourriez ajouter la logique pour ajouter à une playlist
  };

  const handleArtistClick = (e) => {
    e.preventDefault();
    // Redirection vers la page de l'artiste si nécessaire
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
                    isCurrentlyPlaying
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label={isCurrentlyPlaying ? "En cours de lecture" : "Lire un extrait"}
                >
                  <Icon
                    lib="fa-solid"
                    name={isCurrentlyPlaying ? "fa-pause" : "fa-play"}
                    className={`text-xl ${isCurrentlyPlaying ? "text-green-400" : "text-white"}`}
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
              
              {/* Playing indicator */}
              {isCurrentlyPlaying && (
                <div className="absolute -top-1 -right-1">
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
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
              <h3 className={`font-medium truncate ${isCurrentTrack ? 'text-green-400' : ''}`}>
                {track.name}
              </h3>
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
          <AddTitre trackId={track.id} playlistId={playlistId} />
        </div>
      </div>
    </div>
  );
};

export default Titre;