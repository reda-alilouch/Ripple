"use client";
import styles from "./Aside.module.css";
import Icon from "@/components/Icon/index";
import Link from "next/link";
import { menuonclick } from "@/js/aside";
import { useTranslation } from "react-i18next";

const Aside = ({ isOpen, locale }) => {
  const { t } = useTranslation("common");
  const AsidesArray = [
    { icon: "bxs-home", lib: "bx", namepage: t("home"), href: "/" },
    { icon: "bxs-user", lib: "bx", namepage: t("artists"), href: "/Artistes" },
    { icon: "bxs-album", lib: "bx", namepage: t("albums"), href: "/Albums" },
    {
      icon: "bxs-playlist",
      lib: "bx",
      namepage: t("playlists"),
      href: "/Playlistes",
    },
  ];

  const displayAsides = AsidesArray.map((item, idx) => (
    <li
      key={item.href || idx}
      className="mb-2 sm:text-base md:text-lg md:mb-4 xl:text-xl xl:mb-6"
    >
      <Link href={`/${locale}${item.href === "/" ? "" : item.href}`}>
        <Icon
          lib={`${item.lib}`}
          name={`${item.icon}`}
          className="mr-2 xl:mr-6"
        />
        <span className="nompage xl:hidden">{item.namepage}</span>
      </Link>
    </li>
  ));

  return (
    <aside
      className={`${styles.aside} aside hidden xl:flex xl:w-1/20 text-black transition-colors duration-1000 dark:bg-slate-900 dark:text-white`}
      id="aside"
    >
      <div className="xl:fixed xl:z-50 xl:left-0 xl:top-16">
        <ul className="p-4 aside-nav">{displayAsides}</ul>
      </div>
    </aside>
  );
};

export default Aside;
