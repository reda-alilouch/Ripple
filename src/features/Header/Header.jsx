"use client";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Darkmode from "@/components/Darkmode/Darkmode";
import Lang from "@/components/Lang";
import Connexion from "@/components/Connexion/Connexion";

import styles from "@/features/Header/Header.module.css";

import Image from "next/image";

import { searchonclick } from "@/js/search";
import { menuonclick } from "@/js/aside";
import { handleConnexion } from "@/js/conexion";

import React from "react";

const Header = ({ onToggleSidebar }) => (
  <header
    className={`${styles.header} fixed shadow right-0 w-full z-40 flex items-center py-3 px-3 gap-4 xl:flex xl:justify-between xl:items-center bg-white transition-colors duration-1000 dark:bg-slate-900`}
  >
    <div
      className="aside-toggle-container text-primary relative z-50 cursor-pointer"
      onClick={menuonclick}
      id="aside-toggle-container"
    >
      <i className=" bx bx-menu aside-toggle text-3xl" id="aside-toggle"></i>
    </div>
    <div className="logo">
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
    </div>
    <nav className="w-full h-10 xl:flex xl:gap-10 xl:items-center">
      <div className="relative w-full xl:w-4/12 h-10 m-auto">
        <form role="search" id="form-search">
          <input
            className="form-control w-10/12 h-10 border absolute bottom-0 right-0 rounded-3xl px-2 py-3 hidden hover:shadow focus:border-none xl:block  xl:w-full transition-colors duration-1000 dark:bg-slate-900 dark:placeholder-white"
            id="bar-search"
            type="search"
            placeholder="Recherche"
            aria-label="Search"
          />
          <div
            className={`${styles["icon-search"]} h-8 w-8 rounded-full absolute right-1 bottom-1`}
            id="icon-search"
            onClick={searchonclick}
          >
            <Icon lib="fa-solid" name="fa-magnifying-glass" className="p-2" />
          </div>
        </form>
      </div>
      <div
        className={` ${styles["btn-group"]} btn-group py-1 btnmobile justify-end hidden xl:!block bg-white transition-colors duration-1000 dark:bg-slate-900`}
        id="btn-group"
      >
        <div className=" flex justify-end xl:items-center gap-3 ">
          <Darkmode />
          <Lang />
          <Connexion />
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
