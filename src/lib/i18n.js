import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Cette configuration est pour le CLIENT UNIQUEMENT
// Elle est initialisée une seule fois
if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
      {
        // lng est détecté par le middleware, mais on met un fallback
        lng: "fr",
        fallbackLng: "fr",
        supportedLngs: ["fr", "en"],
        ns: ["common", "auth", "messages", "footer"],
        defaultNS: "common",
        backend: {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        detection: {
          order: ["path", "cookie", "navigator", "htmlTag"],
          lookupFromPathIndex: 0,
          lookupCookie: "i18next",
          caches: ["cookie"],
        },
        react: {
          useSuspense: false,
        },
        interpolation: {
          escapeValue: false, // React gère déjà l'échappement
        },
        debug: true,
      },
      (err, t) => {
        if (err) {
          console.error("Erreur d'initialisation i18next:", err);
        } else {
          console.log("i18next initialisé avec la langue:", i18n.language);
        }
      }
    );

  i18n.on("languageChanged", (lng) => {
    console.log("Langue changée:", lng);
  });
}

export default i18n;
