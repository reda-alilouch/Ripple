// src/app/api/auth/session/route.js
import { getServerSession } from "@auth/core";
import { authConfig } from "../[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(request, authConfig);
  return new Response(JSON.stringify(session || null), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}