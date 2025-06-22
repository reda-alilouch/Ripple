"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import styles from "./Lang.module.css"; // ton module CSS

export default function LangSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => setIsOpen(!isOpen);

  const changeLanguage = (newLocale) => {
    // ex: /fr/profil -> /en/profil
    const newPath = pathname.replace(`/${i18n.language}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const getCurrentLanguageName = () => {
    return i18n.language === "en" ? "English" : "Français";
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
