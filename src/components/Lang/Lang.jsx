"use client";
import { useState } from "react";
import styles from "./Lang.module.css"; // ton module CSS

export default function LangSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLang = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleLang}
        className="xl:flex xl:items-center xl:gap-2 border rounded-3xl w-20 h-8 text-xs text-center xl:w-28 xl:h-10 xl:text-sm xl:px-3 hover:shadow"
      >
        <i className="bx bx-globe !hidden xl:!block xl:text-lg" />
        Français
      </button>

      <div
        className={`${styles.lang} absolute top-12 left-0 w-20 xl:w-28 border bg-white py-2 shadow ${
          isOpen ? styles.active : ""
        }`}
      >
        <ul className="text-sm text-center">
          <li className="py-1 hover:bg-gray-100 cursor-pointer">Français</li>
          <li className="py-1 hover:bg-gray-100 cursor-pointer">English</li>
        </ul>
      </div>
    </div>
  );
}
