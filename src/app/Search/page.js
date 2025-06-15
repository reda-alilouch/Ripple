"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Titre from "@/components/Card/Titre/Titre";
import SearchBar from "@/components/SearchBar/SearchBar";
import Icon from "@/components/Icon";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Écouter l'événement de mise à jour de recherche
  useEffect(() => {
    const handleSearchUpdate = (event) => {
      const searchValue = event.detail.query;
      setSearchTerm(searchValue);
    };

    window.addEventListener('searchUpdate', handleSearchUpdate);
    return () => {
      window.removeEventListener('searchUpdate', handleSearchUpdate);
    };
  }, []);

  // Charger les résultats de recherche quand le terme change
  useEffect(() => {
    const search = async () => {
      if (!searchTerm) {
        setSearchResults(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la recherche');
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur recherche:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      search();
    }, 300); // Délai avant de lancer la recherche
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Chargement initial si un terme est présent dans l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      if (q) {
        setSearchTerm(q);
      }
    }
  }, []);

  // Fonction pour afficher les résultats de recherche
  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!searchResults) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Recherchez votre musique préférée
          </h2>
          <p className="text-gray-400">
            Trouvez des titres, des artistes, des albums et des playlists
          </p>
        </div>
      );
    }

    const hasResults = 
      (searchResults.tracks?.length > 0) ||
      (searchResults.artists?.length > 0) ||
      (searchResults.albums?.length > 0) ||
      (searchResults.playlists?.length > 0);

    if (!hasResults) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Aucun résultat trouvé
          </h2>
          <p className="text-gray-400">
            Essayez d'autres termes de recherche ou explorez nos playlists
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Section Titres */}
        {searchResults.tracks?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Titres</h2>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="space-y-2">
                {searchResults.tracks.map((track) => (
                  <div key={track.id} className="bg-gray-700/50 hover:bg-gray-600/50 rounded p-2 transition-colors">
                    <Titre track={track} className="text-white" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Artistes */}
        {searchResults.artists?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Artistes</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {searchResults.artists.map((artist) => (
                <div
                  key={artist.id}
                  className="group p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/artist/${artist.id}`)}
                >
                  <div className="overflow-hidden mb-3 rounded-full aspect-square shadow-lg">
                    <img
                      src={artist.images[0]?.url || "/img/default-cover.jpg"}
                      alt={artist.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-medium text-white line-clamp-1 text-center">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-400 text-center">Artiste</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Albums */}
        {searchResults.albums?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Albums</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {searchResults.albums.map((album) => (
                <div
                  key={album.id}
                  className="group p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/album/${album.id}`)}
                >
                  <div className="relative mb-3 overflow-hidden rounded-md aspect-square shadow-lg">
                    <img
                      src={album.images[0]?.url || "/img/default-cover.jpg"}
                      alt={album.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon lib="fa-solid" name="fa-play" className="text-white text-4xl" />
                    </div>
                  </div>
                  <h3 className="font-medium text-white line-clamp-1 mt-2">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {album.artists.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(album.release_date).getFullYear()} •{" "}
                    {album.album_type}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Playlists */}
        {searchResults.playlists?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Playlists</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {searchResults.playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/playlist/${playlist.id}`)}
                >
                  <div className="relative mb-3 overflow-hidden rounded-md aspect-square shadow-lg">
                    <img
                      src={playlist.images[0]?.url || "/img/default-cover.jpg"}
                      alt={playlist.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-medium text-white line-clamp-1">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    Par {playlist.owner.display_name} •{" "}
                    {playlist.tracks.total}{" "}
                    {playlist.tracks.total > 1 ? "titres" : "titre"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <SearchBar />
          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
        {renderSearchResults()}
      </div>
    </div>
  );
}
