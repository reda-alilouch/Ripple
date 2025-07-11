import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";


export const useSpotifyPlayer = () => {
    const { data: session } = useSession(); // Add this line
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // ───────────────────────────────────────────────────────────────
  // Rafraîchir le token s'il est expiré
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("spotify_refresh_token");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await fetch("/api/spotify/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem(
          "spotify_expires_at",
          Date.now() + data.expires_in * 1000
        );
        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }
        return data.access_token;
      }

      throw new Error(data.error || "Token refresh failed");
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }, []);

  // ───────────────────────────────────────────────────────────────
  // Obtenir un token valide (vérifie l'expiration)
  const getValidToken = useCallback(async () => {
    if (!session?.accessToken) return null;
    // Use session.accessToken instead of localStorage
    return session.accessToken;
  }, [session]);

  // ───────────────────────────────────────────────────────────────
  // Initialiser le lecteur Spotify Web SDK
  useEffect(() => {
    const loadPlayer = async () => {
      if (!window.Spotify) {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => loadPlayer();
        return;
      }

      const token = await getValidToken();
      if (!token) return;

      const spotifyPlayer = new window.Spotify.Player({
        name: "Your App Web Player",
        getOAuthToken: async (cb) => {
          const validToken = await getValidToken();
          cb(validToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
        localStorage.setItem("spotify_device_id", device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device offline", device_id);
        setIsReady(false);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      spotifyPlayer.addListener("initialization_error", ({ message }) =>
        console.error("Init error", message)
      );

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error("Auth error", message);
        refreshToken();
      });

      spotifyPlayer.addListener("account_error", ({ message }) =>
        console.error("Account error", message)
      );

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    loadPlayer();

    return () => {
      if (player) player.disconnect();
    };
  }, [getValidToken, refreshToken]);

  // ───────────────────────────────────────────────────────────────
  // Actualiser la position en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        player.getCurrentState().then((state) => {
          if (state) setPosition(state.position);
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  // ───────────────────────────────────────────────────────────────
  // Fonctions de contrôle du lecteur
  const togglePlay = useCallback(() => {
    player?.togglePlay();
  }, [player]);

  const nextTrack = useCallback(() => {
    player?.nextTrack();
  }, [player]);

  const previousTrack = useCallback(() => {
    player?.previousTrack();
  }, [player]);

  const seek = useCallback(
    (pos) => {
      player?.seek(pos);
    },
    [player]
  );

  const setVolume = useCallback(
    (vol) => {
      player?.setVolume(vol);
    },
    [player]
  );

  // ───────────────────────────────────────────────────────────────
  // Lire une piste spécifique
  const playTrack = useCallback(
    async (uri, contextUri = null) => {
      if (!deviceId) return;
      const token = await getValidToken();
      if (!token) return;

      const body = contextUri
        ? { context_uri: contextUri, offset: { uri } }
        : { uris: [uri] };

      try {
        await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
      } catch (error) {
        console.error("playTrack error:", error);
      }
    },
    [deviceId, getValidToken]
  );

  const tracks = [];
  const playlistId = null; 

  return {
    player,
    isReady,
    deviceId,
    currentTrack,
    isPlaying,
    position,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    playTrack,
  };
};
