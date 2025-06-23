"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children }) {
  // On retourne toujours le provider.
  // La gestion du mismatch serveur/client est déjà faite dans le Header
  // et avec `suppressHydrationWarning` dans le layout.
  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
}
