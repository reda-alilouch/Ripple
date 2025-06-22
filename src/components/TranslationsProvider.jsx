"use client";

import { I18nextProvider } from "react-i18next";
import initI18next from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function TranslationsProvider({ children, locale, namespaces }) {
  const [i18n, setI18n] = useState(null);

  useEffect(() => {
    const init = async () => {
      const newInstance = await initI18next(locale, namespaces);
      setI18n(newInstance);
    };

    init();
  }, [locale, namespaces]);

  if (!i18n) {
    return null; // Ou un composant de chargement
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
