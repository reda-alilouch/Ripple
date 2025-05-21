// src/lib/utils.js

/**
 * Convertit une durée en millisecondes en format mm:ss
 * @param {number} ms - Durée en millisecondes
 * @returns {string} - Durée formatée (mm:ss)
 */
export function formatDuration(ms) {
  // Vérifier si ms est undefined ou null
  if (ms === undefined || ms === null) return "00:00";

  // Convertir en nombre si c'est une chaîne
  const milliseconds = typeof ms === "string" ? parseInt(ms, 10) : ms;

  // Vérifier si c'est un nombre valide
  if (isNaN(milliseconds) || milliseconds < 0) return "00:00";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Tronque un texte s'il dépasse une certaine longueur
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - Texte tronqué avec "..." si nécessaire
 */
export function truncateText(text, maxLength = 25) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
}

/**
 * Récupère un token Spotify depuis l'API (pour utilisation côté client)
 * @returns {Promise<string>} - Token d'accès
 */
export async function getSpotifyToken() {
  try {
    const response = await fetch("/api/spotify/token");
    if (!response.ok) {
      throw new Error("Échec de récupération du token");
    }
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    throw error;
  }
}
