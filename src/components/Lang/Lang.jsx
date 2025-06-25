"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Lang.module.css"; // ton module CSS

const COOKIE_NAME = "i18next";

export default function LangSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Dériver la langue directement de l'URL pour plus de fiabilité
  const currentLocale = pathname.split("/")[1];

  const toggleLang = () => setIsOpen(!isOpen);

  const changeLanguage = (newLocale) => {
    // 1. Définir le cookie pour mémoriser le choix
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=31536000`;

    // 2. Changer l'URL
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const getCurrentLanguageName = () => {
    return currentLocale === "en" ? "English" : "Français";
  };

  return (
    <div className="relative">
      <button
        onClick={toggleLang}
        className="w-20 h-8 text-xs text-center text-black rounded-3xl border xl:flex xl:items-center xl:gap-2 xl:w-28 xl:h-10 xl:text-sm xl:px-3 hover:shadow dark:text-white dark:hover:shadow-customdark"
      >
        <i className="bx bx-globe text-black dark:text-white !hidden xl:!block xl:text-lg" />
        {getCurrentLanguageName()}
      </button>

      <div
        className={`${
          styles.lang
        } absolute top-12 left-0 w-20 xl:w-28 border bg-white py-2 shadow transition-colors duration-1000 dark:bg-slate-900 dark:text-white ${
          isOpen ? styles.active : ""
        }`}
      >
        <ul className="text-sm text-center">
          <li
            className="py-1 text-black cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800"
            onClick={() => changeLanguage("fr")}
          >
            Français
          </li>
          <li
            className="py-1 text-black cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800"
            onClick={() => changeLanguage("en")}
          >
            English
          </li>
        </ul>
      </div>
    </div>
  );
}
