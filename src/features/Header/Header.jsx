"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

import SearchBar from "@/components/SearchBar/SearchBar";
import Icon from "@/components/Icon";
import Darkmode from "@/components/Darkmode/Darkmode";
import Lang from "@/components/Lang";
import Connexion from "@/components/Connexion/Connexion";

import styles from "@/features/Header/Header.module.css";

import { menuonclick } from "@/js/aside";

const Header = ({ onToggleSidebar }) => {
  return (
    <header
      className={`${styles.header} fixed shadow right-0 w-full z-40 flex items-center py-3 px-3 gap-4 xl:flex xl:justify-between xl:items-center bg-white transition-colors duration-1000 dark:bg-slate-900`}
    >
      <div
        className="relative z-50 cursor-pointer aside-toggle-container text-primary"
        onClick={menuonclick}
        id="aside-toggle-container"
      >
        <i className="text-3xl bx bx-menu aside-toggle" id="aside-toggle"></i>
      </div>
      <div className="logo" id="logo">
        <Link href="/">
          <Image
            src="/lightmd.png"
            alt="ripple logo"
            width={130}
            height={38}
            priority
            className="block dark:hidden"
          />
        </Link>
        <Link href="/">
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
          <div className="flex gap-3 justify-end xl:items-center">
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
