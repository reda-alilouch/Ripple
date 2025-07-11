"use client";
import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Icon from "@/components/Icon";
import AddTitre from "@/components/AddTitre/AddTitre";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

const Audio = ({ tracks = [], playlistId = null }) => {
  const { data: session } = useSession();
  const swiperRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    isReady,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    playTrack,
  } = useSpotifyPlayer();

  // Don't render if no session
  if (!session) {
    return (
      <div className="fixed bottom-0 left-0 z-20 w-full bg-white dark:bg-slate-900 dark:text-white px-3 py-2 text-center">
        <p>Connectez-vous à Spotify pour écouter la musique</p>
      </div>
    );
  }

  const formatTime = (ms) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayTrack = async (track) => {
    if (!track || !isReady) return;

    // Try to play with Spotify URI first
    if (track.uri) {
      try {
        await playTrack(track.uri);
      } catch (error) {
        console.error("Error playing track:", error);
      }
    }
  };

  const handleNextTrack = () => {
    if (tracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      handlePlayTrack(tracks[nextIndex]);
    } else {
      nextTrack();
    }
  };

  const handlePreviousTrack = () => {
    if (tracks.length > 0) {
      const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      handlePlayTrack(tracks[prevIndex]);
    } else {
      previousTrack();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-20 w-full bg-white dark:bg-slate-900 dark:text-white px-3 py-2 grid sm:flex sm:justify-between items-center">
      {/* ─── Current Track ─── */}
      <div className="flex items-center gap-3">
        <Image
          src={currentTrack?.album?.images[0]?.url || currentTrack?.image || "/images/audio.png"}
          alt={currentTrack?.name || "audio"}
          width={70}
          height={70}
          className="rounded-md object-cover"
        />
        <div>
          <h3 className="mb-1 text-sm font-medium">
            {currentTrack?.name || "Nom du titre"}
          </h3>
          <h4 className="text-xs text-gray-600 dark:text-gray-400">
            {currentTrack?.artists?.map((a) => a.name).join(", ") || "Artiste"}
          </h4>
        </div>
      </div>

      {/* ─── Transport Buttons ─── */}
      <div className="flex gap-5 items-center justify-center">
        <button 
          onClick={handlePreviousTrack} 
          disabled={!isReady}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <Icon lib="bx" name="bx-skip-previous" className="text-2xl" />
        </button>

        <button 
          onClick={togglePlay} 
          disabled={!isReady}
          className="p-3 rounded-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white"
        >
          <Icon 
            lib="fa-solid" 
            name={isPlaying ? "fa-pause" : "fa-play"} 
            className="text-lg"
          />
        </button>

        <button 
          onClick={handleNextTrack} 
          disabled={!isReady}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <Icon lib="bx" name="bx-skip-next" className="text-2xl" />
        </button>
      </div>

      {/* ─── Time Progress ─── */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {formatTime(position)}
        </span>
        <div
          className="w-24 h-2 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer"
          onClick={(e) => {
            if (!duration) return;
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - left) / width;
            seek(percent * duration);
          }}
        >
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: duration ? `${(position / duration) * 100}%` : "0%" }}
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {formatTime(duration)}
        </span>
      </div>

      {/* ─── Track List (Mobile) ─── */}
      <div className="block lg:hidden mt-4 w-full">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={10}
          slidesPerView={1}
          onSlideChange={(swiper) => setCurrentTrackIndex(swiper.activeIndex)}
        >
          {tracks.length ? (
            tracks.map((track, index) => (
              <SwiperSlide key={track.spotifyId || track._id || index}>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Image
                    src={track.image || track.album?.images?.[0]?.url || "/images/audio.png"}
                    alt={track.name || "Track"}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{track.name || "Titre inconnu"}</h3>
                    <h4 className="text-xs text-gray-600 dark:text-gray-400">
                      {track.artists?.map(a => a.name).join(", ") || "Artiste inconnu"}
                    </h4>

                    <div className="flex gap-2 mt-2">
                      {track.uri && (
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 disabled:opacity-50"
                          disabled={!isReady}
                        >
                          {isPlaying && currentTrack?.id === track.spotifyId ? "Pause" : "Écouter"}
                        </button>
                      )}

                      {track.preview_url && (
                        <audio controls src={track.preview_url} className="h-8" />
                      )}
                    </div>

                    <AddTitre trackId={track._id} playlistId={playlistId} />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun titre disponible</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* ─── Volume & Status (Desktop) ─── */}
      <div className="hidden lg:flex items-center gap-4">
        <Icon lib="fa-solid" name="fa-volume-up" className="text-gray-600 dark:text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          defaultValue="0.5"
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {isReady ? "🟢 Spotify connecté" : "🔴 Non connecté"}
        </span>
      </div>
    </div>
  );
};

export default Audio;