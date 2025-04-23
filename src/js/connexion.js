
const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-public",
    "user-library-read"
  ];
  
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=8488770d6a074502b2eca0b8cfecdbb0&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&redirect_uri=${encodeURIComponent("https://ripple.com/api/auth/callback")}`;
  