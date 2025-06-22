"use client";
import styles from "./Aside.module.css";
import Icon from "@/components/Icon/index";
import Link from "next/link";

const AsidesArray = [
  { icon: "bxs-home", lib: "bx", namepage: "Accueil", href: "/" },
  { icon: "bxs-user", lib: "bx", namepage: "Artistes", href: "/Artistes" },
  { icon: "bxs-album", lib: "bx", namepage: "Albums", href: "/Albums" },
  {
    icon: "bxs-playlist",
    lib: "bx",
    namepage: "Playlistes",
    href: "/Playlistes",
  },
];

const displayAsides = AsidesArray.map((item) => (
  <li className="mb-2 sm:text-base md:text-lg md:mb-4 xl:text-xl xl:mb-6">
    <Link href={`${item.href}`}>
      <Icon
        lib={`${item.lib}`}
        name={`${item.icon}`}
        className="mr-2 xl:mr-6"
      />
      <span className="nompage xl:hidden">{item.namepage}</span>
    </Link>
  </li>
));

const Aside = ({ isOpen }) => {
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
