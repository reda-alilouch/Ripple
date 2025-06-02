"use client";
import { useState, useEffect } from "react";
import Titre from "@/components/Card/Titre/Titre";

export default function TitreList() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("/api/spotify/data?type=tracks&limit=10");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des titres");
        }
        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Chargement des titres...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center p-4">
        Aucun titre trouvé.
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/spotify/sync");
              if (!response.ok) throw new Error("Erreur de synchronisation");
              window.location.reload();
            } catch (err) {
              setError(err.message);
            }
          }}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          Synchroniser avec Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Titres populaires</h2>
      <div className="grid gap-4">
        {tracks.map((track) => (
          <Titre
            key={track.spotifyId}
            trackName={track.name}
            artistName={track.artists[0]?.name || "Artiste inconnu"}
            albumImage={track.album.images[0]?.url || "/placeholder-track.jpg"}
            duration={track.duration_ms}
            trackId={track.spotifyId}
          />
        ))}
      </div>
    </div>
  );
}
