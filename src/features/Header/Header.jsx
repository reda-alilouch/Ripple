"use client";
import { searchonclick } from "@/js/search";
import { menuonclick } from "@/js/aside";
import { traduireonclick } from "@/js/traduire";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import styles from "@/features/Header/Header.module.css";
import { handleConnexion} from "@/js/conexion";

import React from "react";

const Header = ({ onToggleSidebar }) => (
  <header
    className={`${styles.header} bg-light flex items-center py-3 px-3 gap-4 xl:flex xl:justify-between xl:items-center`}
  >
    <div className="aside-toggle-container text-primary" onClick={menuonclick}>
      <i className="bx bx-menu text-3xl aside-toggle " id="aside-toggle"></i>
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
            className="icon-search h-8 w-8 rounded-full absolute right-1 bottom-1 "
            id="icon-search"
            onClick={searchonclick}
          >
            <Icon lib="fa-solid" name="fa-magnifying-glass" className="p-2" />
          </div>
        </form>
      </div>
      <div
        className="btn-group py-1 btnmobile justify-end xl:flex xl:justify-end xl:items-center"
        id="btn-group"
      >
        <div className="flex justify-end gap-2">
          <div className="mode" id="darkModeToggle">
            <input type="checkbox" className="checkbox btn button" id="checkbox" />
            <label
              htmlFor="checkbox"
              className="checkbox-label border btn w-20 h-8 xl:w-24 xl:h-10"
            >
              <i className="fa fa-moon"></i>
              <i className="fa fa-sun"></i>
              <span className="ball"></span>
            </label>
          </div>
          <div>
            <div className="relative">
              <Button
                id="dropdown"
                name="Français"
                className="border rounded-3xl w-20 h-8 text-center text-xs xl:w-32 xl:h-10"
                onClick={traduireonclick}
              />
              <i className="bx bx-globe absolute left-1 hidden"></i>
              <i className="bx bx-chevron-down absolute right-1 hidden"></i>
            </div>
            <div className="lang border mt-3 py-2 w-20 xl:w-32" id="lang">
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
                className="border rounded-3xl w-20 h-8 text-center text-xs xl:w-32 xl:h-10"
                onClick={handleConnexion}
              />
            </a>
          </div>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
