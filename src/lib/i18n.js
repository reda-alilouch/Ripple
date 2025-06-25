import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Cette configuration est pour le CLIENT UNIQUEMENT
// Elle est initialisée une seule fois
if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      // lng est détecté par le middleware, mais on met un fallback
      lng: "fr",
      fallbackLng: "fr",
      supportedLngs: ["fr", "en"],
      ns: ["common", "auth", "messages", "footer"],
      defaultNS: "common",
      backend: {
        loadPath: "/api/translations/{{lng}}/{{ns}}",
      },
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false, // React gère déjà l'échappement
      },
    });
}

export default i18n;
