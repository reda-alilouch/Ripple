"use client";
import { searchonclick } from "@/js/search";
import { menuonclick } from "@/js/aside";
import { traduireonclick } from "@/js/traduire";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Darkmode from "@/components/Darkmode/Darkmode";

import styles from "@/features/Header/Header.module.css";
import { handleConnexion } from "@/js/conexion";

import React from "react";

const Header = ({ onToggleSidebar }) => (
  <header
    className={`${styles.header} bg-light flex items-center py-3 px-3 gap-4 xl:flex xl:justify-between xl:items-center`}
  >
    <div
      className={`${styles["aside-toggle-container"]} text-primary`}
      onClick={menuonclick}
    >
      <i
        className={`bx bx-menu text-3xl ${styles["aside-toggle"]}`}
        id="aside-toggle"
      ></i>
    </div>

    <nav className="w-full h-10 xl:flex xl:justify-between xl:items-center">
      <div className="relative w-full h-10 m-auto">
        <form role="search" id="form-search">
          <input
            className="form-control w-10/12 h-10 border absolute bottom-0 right-0 rounded-3xl px-2 py-3 hidden focus:border-none xl:block xl:w-5/12"
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
        className={` ${styles["btn-group"]} btn-group py-1 btnmobile justify-end xl:flex xl:justify-end xl:items-center`}
        id="btn-group"
      >
        <Darkmode />
        <div>
          <div className="relative">
            <Button
              id="dropdown"
              name="Français"
              className="border rounded-3xl w-20 h-8 text-center text-xs xl:w-32 xl:h-10 xl:text-base"
              onClick={traduireonclick}
            />
            <Icon
              lib="bx"
              name="bx-globe"
              className="absolute left-2 top-3 !hidden xl:text-base xl:!block"
            />
            <Icon
              lib="bx"
              name="bx-chevron-down"
              className="absolute right-2 top-3 !hidden xl:text-base xl:!block"
            />
          </div>
          <div
            className={`${styles.lang} border mt-3 py-2 w-20 xl:w-32`}
            id="lang"
          >
            <ul>
              <li className="text-xs mb-1">Français</li>
              <li className="text-xs mt-1">English</li>
            </ul>
          </div>
        </div>

        <div>
          <a href="#">
            <Button
              id="btn-connexion"
              name="Connexion"
              className="border rounded-3xl w-20 h-8 text-center text-xs xl:w-32 xl:h-10 xl:text-base"
              onClick={handleConnexion}
            />
          </a>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
