import NextAuth from "next-auth";
import { authConfig } from "../config/auth.config";

export const runtime = "nodejs";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

// Ajout des autres méthodes HTTP pour éviter l'erreur 405
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
