"use client";
import { useEffect } from "react";
import i18n from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function ForceI18nLanguageFromUrl() {
  const pathname = usePathname();
  useEffect(() => {
    const locale = pathname.split("/")[1];
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [pathname]);
  return null;
}
