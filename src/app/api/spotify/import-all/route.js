// app/api/spotify/import-all/route.js
import { NextResponse } from "next/server";

const client_id = "8488770d6a074502b2eca0b8cfecdbb0";
const client_secret = "574ce51d4be2452f86cafbfa628096b0";

try {
  const authString = btoa(`${client_id}:${client_secret}`);

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) {
    throw new Error("Erreur lors de la récupération du token.");
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  const response = await fetch(
    "https://api.spotify.com/v1/search?q=daft&type=artist",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des artistes.");
  }

  const data = await response.json();
  console.log("✅ Données Spotify :", data);
  setMessage("Importation réussie !");
} catch (error) {
  console.error("❌ Erreur :", error.message);
  setMessage("Erreur lors de l'import : " + error.message);
}
