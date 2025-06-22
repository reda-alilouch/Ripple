"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Titre from "@/components/Card/Titre/Titre";

// Création d'une instance axios avec une configuration de base
const spotifyApi = axios.create({
  baseURL: '/api/spotify',
  timeout: 10000, // 10 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function ListTrack() {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Utilisation d'Axios pour faire la requête via notre route API interne
        const response = await axios.get('/api/spotify/search', {
          params: {
            q: 'popular', // Recherche avec un terme plus générique
            types: 'track', // Type de recherche : pistes
            limit: 9 // Limite à 9 résultats
          },
          timeout: 10000, // Timeout de 10 secondes
        });
        
        const data = response.data;
        console.log("Réponse complète de l'API:", data);
        
        // Vérifier si nous avons des pistes dans la réponse
        if (!data.tracks) {
          console.error("Aucune donnée de piste dans la réponse:", data);
          throw new Error("Aucune donnée de piste disponible");
        }
        
        // Afficher la structure des pistes pour le débogage
        console.log("Structure des pistes:", {
          estTableau: Array.isArray(data.tracks),
          aProprietes: Object.keys(data.tracks),
          premierElement: data.tracks[0], // Afficher le premier élément tel quel
          structureComplete: JSON.stringify(data.tracks, null, 2) // Afficher la structure complète
        });
        
        // Vérifier si c'est un objet avec une propriété 'items'
        if (data.tracks && data.tracks.items && Array.isArray(data.tracks.items)) {
          console.log("Format détecté: data.tracks.items");
          data.tracks = data.tracks.items; // Remplacer par le tableau d'items
        }
        
        // Vérifier que data.tracks est bien un tableau
        if (!Array.isArray(data.tracks)) {
          console.error("Format de données inattendu pour les pistes:", data.tracks);
          throw new Error("Format de données incorrect pour les pistes");
        }
        
        // Traiter chaque piste avec une gestion d'erreur individuelle
        const topTracks = data.tracks
          .filter(track => {
            // Vérifier que la piste a un ID et un nom
            const isValid = track && track.id && track.name;
            if (!isValid) {
              console.warn("Piste invalide ignorée:", track);
            }
            return isValid;
          })
          .map(track => {
            try {
              console.log("Traitement de la piste:", track);
              
              // Extraire les artistes (déjà formatés par l'API)
              const artists = Array.isArray(track.artists) 
                ? track.artists
                    .filter(artist => artist && artist.id && artist.name)
                    .map(artist => ({
                      id: artist.id,
                      name: artist.name
                    }))
                : [];
              
              // Extraire les informations de l'album
              const album = track.album || {};
              const images = Array.isArray(album.images) ? album.images : [];
              
              // Utiliser l'image de l'album ou une image par défaut
              const imageUrl = images[0]?.url || '/default-album.jpg';
              
              return {
                id: track.id,
                name: track.name,
                artists: artists,
                album: {
                  id: album.id,
                  name: album.name || 'Album inconnu',
                  images: images
                },
                image: imageUrl,
                preview_url: track.preview_url || null,
                external_url: track.external_urls?.spotify || `https://open.spotify.com/track/${track.id}`,
                duration_ms: track.duration_ms || 0
              };
            } catch (error) {
              console.error("Erreur lors du traitement d'une piste:", error, track);
              return null; // Retourner null pour les pistes en erreur
            }
          })
          .filter(Boolean); // Filtrer les pistes null (en erreur)
          
        console.log("Pistes transformées:", topTracks);
        setTracks(topTracks);
        
      } catch (err) {
        console.error("Erreur lors de la récupération des titres:", err);
        const errorMessage = err.response?.data?.error?.message || 
                           err.message || 
                           "Impossible de charger les titres. Veuillez réessayer plus tard.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

  if (isLoading) {
    return (
      <section className="section container">
        <div className="head pt-5 px-5">
          <h2 className="top font-bold">Top titres</h2>
        </div>
        <div className="px-5">Chargement des titres en cours...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section container">
        <div className="head pt-5 px-5">
          <h2 className="top font-bold">Top titres</h2>
        </div>
        <div className="px-5 text-red-500">
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-2 text-blue-400 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="head pt-5 px-5">
        <h2 className="top font-bold">Top titres</h2>
      </div>
      <div className="song-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tracks.length === 0 ? (
          <div className="px-5 col-span-full text-center py-10">
            <p className="text-gray-400">Aucun titre trouvé.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-blue-400 hover:underline"
            >
              Actualiser
            </button>
          </div>
        ) : (
          tracks.map((track, index) => (
            <Titre 
              key={track.id} 
              track={track} 
              className={
                index >= 3 && index < 6 ? "hidden sm:block" : 
                index >= 6 ? "hidden sm:hidden md:hidden lg:block" : ""
              } 
            />
          ))
        )}
      </div>
    </section>
  );
}
