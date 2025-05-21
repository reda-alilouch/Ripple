"use client";

import { useState, useEffect } from "react";
import Titre from "@/src/components/Titre"; // Ajustez le chemin si nécessaire

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data = await response.json();
      setSearchResults(data);
      console.log("Résultats de recherche:", data);
    } catch (err) {
      console.error("Erreur de recherche:", err);
      setError("Une erreur est survenue lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Rechercher des chansons, artistes, albums..."
          className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-md"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Recherche..." : "Rechercher"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {searchResults && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Chansons</h2>
          {searchResults.tracks.length === 0 ? (
            <p>Aucune chanson trouvée</p>
          ) : (
            <div className="grid gap-4">
              {searchResults.tracks.map((track) => (
                <Titre
                  key={track.id}
                  trackName={track.name}
                  artistName={track.artists[0].name}
                  albumImage={track.album.images[0]?.url || "/img/default-cover.jpg"}
                  duration={track.duration_ms}
                  trackId={track.id}
                />
              ))}
            </div>
          )}
          
          {/* Vous pouvez ajouter d'autres sections pour albums, artistes, etc. */}
        </div>
      )}
    </div>
  );
}