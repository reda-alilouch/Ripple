"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ArtistesPage() {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 12;

  useEffect(() => {
    const fetchArtistes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/artistes?page=${page}&limit=${limit}`);
        const data = await res.json();
        setArtists(data.artists || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError("Erreur lors du chargement des artistes");
      } finally {
        setLoading(false);
      }
    };
    fetchArtistes();
  }, [page]);

  return (
    <section className="container px-5 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Tous les artistes</h1>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {artists.map((artist) => (
              <div key={artist.id} className="flex flex-col items-center">
                <Image
                  src={artist.image || "/default-artist.svg"}
                  alt={artist.name}
                  className="object-cover w-24 h-24 mb-2 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-artist.svg";
                  }}
                />
                <span className="w-full font-medium text-center truncate">
                  {artist.name}
                </span>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </section>
  );
}
