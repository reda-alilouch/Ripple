import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotify.js";
import axios from "axios";

// Types de recherche par défaut (optimisé pour la page d'accueil)
const DEFAULT_TYPES = ["track", "artist"];
const DEFAULT_LIMIT = 8;

// Timeout pour les requêtes (en millisecondes)
const REQUEST_TIMEOUT = 5000;

// GET /api/spotify/search?q=eminem&types=track,artist&limit=5
export async function GET(req) {
  const startTime = Date.now();
  
  try {
    // Vérification des variables d'environnement
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      console.error('Variables d\'environnement manquantes');
      return NextResponse.json(
        { error: "Configuration du serveur incomplète" },
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const typesParam = searchParams.get("types");
    const limit = parseInt(searchParams.get("limit") || DEFAULT_LIMIT, 10);
    
    const types = typesParam ? typesParam.split(",") : DEFAULT_TYPES;
    
    if (!query) {
      return NextResponse.json(
        { error: "Le paramètre de recherche 'q' est requis" },
        { status: 400 }
      );
    }
    
    // Obtenir le token d'accès
    const access_token = await getAccessToken();
    
    if (!access_token) {
      console.error('Échec de l\'obtention du token d\'accès');
      return NextResponse.json(
        { error: "Impossible d'obtenir un token d'accès Spotify" },
        { status: 500 }
      );
    }
    
    // Créer une instance d'Axios avec les paramètres de base
    const spotifyApi = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      timeout: REQUEST_TIMEOUT
    });

    // Préparer les requêtes pour chaque type
    const searchPromises = types.map(async (type) => {
      try {
        const response = await spotifyApi.get('/search', {
          params: {
            q: query,
            type: type,
            limit: limit
          }
        });

        return { 
          type, 
          items: response.data[`${type}s`]?.items || [], 
          error: null 
        };
      } catch (error) {
        console.error(`Erreur lors de la recherche de type ${type}:`, error);
        return { 
          type, 
          items: [], 
          error: error.response?.data?.error?.message || error.message 
        };
      }
    });

    // Exécuter les requêtes en parallèle
    const results = await Promise.all(searchPromises);

    // Formater la réponse pour ne renvoyer que les données nécessaires
    const formatItems = (items) => {
      if (!items) return [];
      return items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        images: item.images,
        artists: item.artists?.map(a => ({
          id: a.id,
          name: a.name
        })),
        album: item.album ? {
          id: item.album.id,
          name: item.album.name,
          images: item.album.images
        } : undefined
      }));
    };
    
    // Construire la réponse finale
    const responseData = { query };
    
    // Ajouter les résultats par type
    results.forEach(({ type, items, error }) => {
      const pluralType = `${type}s`; // 'track' -> 'tracks'
      if (error) {
        console.error(`Erreur pour le type ${type}:`, error);
        responseData[pluralType] = [];
      } else {
        responseData[pluralType] = formatItems(items);
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`Recherche effectuée en ${duration}ms`);
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Erreur de recherche Spotify:", error);
    
    // Gérer spécifiquement les timeouts
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: "La recherche a pris trop de temps" },
        { status: 504 } // Gateway Timeout
      );
    }
    
    return NextResponse.json(
      { 
        error: "Une erreur est survenue lors de la recherche",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: error.status || 500 }
    );
  }
}
