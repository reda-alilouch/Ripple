"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";

import SearchBar from "@/components/SearchBar/SearchBar";
import Darkmode from "@/components/Darkmode/Darkmode";
import Lang from "@/components/Lang";
import Connexion from "@/components/Connexion/Connexion";
import styles from "@/features/Header/Header.module.css";
import { menuonclick } from "@/js/aside";
const Header = ({ onToggleSidebar }) => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const locale = i18n.language;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && theme === "dark" ? "/darkmd.png" : "/lightmd.png";

  return (
    <header
      className={`${styles.header} fixed shadow right-0 w-full z-40 flex items-center py-3 px-3 gap-4 xl:flex xl:justify-between xl:items-center bg-white dark:bg-slate-900`}
    >
      <div
        className="relative z-50 cursor-pointer aside-toggle-container text-primary"
        onClick={menuonclick}
        id="aside-toggle-container"
      >
        <i className="text-3xl bx bx-menu aside-toggle" id="aside-toggle"></i>
      </div>
      <div className="logo" id="logo">
        <Link href={`/${locale}/`}>
          <Image
            src="/lightmd.png"
            alt="ripple logo"
            width={130}
            height={38}
            priority
            className="block dark:hidden"
          />
          <Image
            src="/darkmd.png"
            alt="ripple logo"
            width={130}
            height={38}
            priority
            className="hidden dark:block"
          />
        </Link>
      </div>
      <nav className="w-full h-10 xl:flex xl:gap-10 xl:items-center">
        <SearchBar />
        <div className="hidden xl:block" id="btn-group">
          <div className="flex justify-end gap-3 xl:items-center">
            <Darkmode />
            <Lang />
            <Connexion />
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
