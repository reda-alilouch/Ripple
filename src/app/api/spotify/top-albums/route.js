// app/api/spotify/top-albums/route.js

import { getAccessToken } from "@/src/lib/spotify/getAccessToken";

export async function GET() {
  const token = await getAccessToken();
  const res = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=10", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return Response.json(data);
}
