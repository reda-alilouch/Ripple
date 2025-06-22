"use client";

import { I18nextProvider } from "react-i18next";
import initI18next from "@/lib/i18n";
import { createInstance } from "i18next";
import { useEffect, useState } from "react";

export default function TranslationsProvider({ children, locale, namespaces }) {
  const [i18n, setI18n] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!i18n) {
        const newInstance = createInstance();
        await initI18next(locale, namespaces, newInstance);
        setI18n(newInstance);
      }
    };
    init();
  }, [locale, namespaces, i18n]);

  if (!i18n) {
    return null; // ou un loader
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
