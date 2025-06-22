import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import HttpBackend from "i18next-http-backend";

const initI18next = async (lng = "fr", ns = "common") => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(HttpBackend)
    .init({
      lng,
      ns,
      defaultNS: "common",
      fallbackLng: "fr",
      backend: {
        // Chemin vers votre API de traduction
        loadPath: `${process.env.NEXT_PUBLIC_APP_URL}/api/translations/{{lng}}/{{ns}}`,
      },
      react: {
        useSuspense: false,
      },
    });
  return i18nInstance;
};

export default initI18next;
