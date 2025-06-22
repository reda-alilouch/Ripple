"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./search.module.css";

// Composant pour afficher une section de résultats
const ResultsSection = ({ title, items, type, isLoading }) => {
  if (isLoading) return null;
  if (!items || items.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${type}/${item.id}`}
            className={styles.card}
          >
            <div className={styles.imageContainer}>
              <Image
                src={item.images?.[0]?.url || "/default-cover.png"}
                alt={item.name}
                width={160}
                height={160}
                className={styles.image}
              />
            </div>
            <div className={styles.info}>
              <h3 className={styles.title}>{item.name}</h3>
              {item.artists && (
                <p className={styles.subtitle}>
                  {item.artists.map((a) => a.name).join(", ")}
                </p>
              )}
              {item.album && item.album.name && (
                <p className={styles.album}>{item.album.name}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// Composant pour afficher les artistes
const ArtistSection = ({ artists, isLoading }) => {
  if (isLoading) return null;
  if (!artists || artists.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Artistes</h2>
      <div className={styles.artistsGrid}>
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}`}
            className={styles.artistCard}
          >
            <div className={styles.artistImageContainer}>
              <Image
                src={artist.images?.[0]?.url || "/default-artist.png"}
                alt={artist.name}
                width={120}
                height={120}
                className={styles.artistImage}
              />
            </div>
            <h3 className={styles.artistName}>{artist.name}</h3>
            <span className={styles.artistType}>Artiste</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fonction pour formater la durée des pistes
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  // Écouter l'événement de mise à jour de recherche
  useEffect(() => {
    const handleSearchUpdate = (event) => {
      const searchValue = event.detail.query;
      setSearchTerm(searchValue);
    };

    window.addEventListener("searchUpdate", handleSearchUpdate);
    return () => {
      window.removeEventListener("searchUpdate", handleSearchUpdate);
    };
  }, []);

  // Charger les résultats de recherche quand le terme change
  useEffect(() => {
    const search = async () => {
      if (!searchTerm) {
        console.log("Aucun terme de recherche, réinitialisation des résultats");
        setSearchResults({
          tracks: [],
          artists: [],
          albums: [],
          playlists: [],
        });
        return;
      }

      console.log("Lancement de la recherche pour:", searchTerm);
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = `/api/spotify/search?q=${encodeURIComponent(
          searchTerm
        )}`;
        console.log("URL de l'API:", apiUrl);

        const response = await fetch(apiUrl);
        const responseData = await response.json();

        console.log("Réponse de l'API:", {
          status: response.status,
          ok: response.ok,
          data: responseData,
        });

        if (!response.ok) {
          const errorMessage =
            responseData?.error ||
            `Erreur ${response.status} lors de la recherche`;
          console.error("Erreur API:", errorMessage);
          throw new Error(errorMessage);
        }

        if (!responseData) {
          throw new Error("Aucune donnée reçue de l'API");
        }

        console.log("Résultats de la recherche:", {
          tracks: responseData.tracks?.length || 0,
          artists: responseData.artists?.length || 0,
          albums: responseData.albums?.length || 0,
          playlists: responseData.playlists?.length || 0,
        });

        setSearchResults(responseData);
      } catch (err) {
        const errorMessage =
          err.message || "Une erreur est survenue lors de la recherche";
        console.error("Erreur recherche:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // Lancer la recherche immédiatement
    search();
  }, [searchTerm]);

  // Chargement initial si un terme est présent dans l'URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
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
      searchResults.tracks?.length > 0 ||
      searchResults.artists?.length > 0 ||
      searchResults.albums?.length > 0 ||
      searchResults.playlists?.length > 0;

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
                  <div
                    key={track.id}
                    className="bg-gray-700/50 hover:bg-gray-600/50 rounded p-2 transition-colors"
                  >
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
                      <Icon
                        lib="fa-solid"
                        name="fa-play"
                        className="text-white text-4xl"
                      />
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
                    Par {playlist.owner.display_name} • {playlist.tracks.total}{" "}
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

  // Charger des données supplémentaires en arrière-plan
  const loadAdditionalData = async (term) => {
    try {
      const apiUrl = `/api/spotify/search?q=${encodeURIComponent(
        term
      )}&types=album,playlist&limit=4`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        // Mettre à jour le cache avec les nouvelles données
        const cacheKey = term.toLowerCase();
        const cachedData = searchCache.get(cacheKey)?.data || {};

        searchCache.set(cacheKey, {
          data: {
            ...cachedData,
            albums: data.albums || [],
            playlists: data.playlists || [],
          },
          timestamp: Date.now(),
        });

        // Mettre à jour l'état avec les nouvelles données
        setSearchResults((prev) => ({
          ...prev,
          albums: data.albums || [],
          playlists: data.playlists || [],
        }));
      }
    } catch (err) {
      console.error(
        "Erreur lors du chargement des données supplémentaires:",
        err
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBar />
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Recherche en cours...</p>
        </div>
      ) : searchTerm ? (
        <div className={styles.results}>
          {/* Résultats des titres */}
          <ResultsSection
            title="Titres"
            items={searchResults.tracks}
            type="track"
            isLoading={isLoading}
          />

          {/* Résultats des artistes */}
          <ArtistSection
            artists={searchResults.artists}
            isLoading={isLoading}
          />

          {/* Résultats des albums */}
          {searchResults.albums?.length > 0 && (
            <ResultsSection
              title="Albums"
              items={searchResults.albums}
              type="album"
              isLoading={false}
            />
          )}

          {/* Résultats des playlists */}
          {searchResults.playlists?.length > 0 && (
            <ResultsSection
              title="Playlists"
              items={searchResults.playlists}
              type="playlist"
              isLoading={false}
            />
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2>Recherchez des titres, artistes, albums ou playlists</h2>
          <p>Utilisez la barre de recherche ci-dessus pour commencer</p>
        </div>
      )}
    </div>
  );
}
