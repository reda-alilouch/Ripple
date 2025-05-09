"use client";
import styles from "./Aside.module.css";
import Icon from "@/components/Icon";

const AsidesArray = [
  { icon: "bxs-home", lib: "bx", namepage: "Accueil" },
  { icon: "bxs-category", lib: "bx", namepage: "Genres" },
  { icon: "bxs-user", lib: "bx", namepage: "Artistes" },
  { icon: "bxs-album", lib: "bx", namepage: "Albums" },
  { icon: "bxs-playlist", lib: "bx", namepage: "Playlistes" },
];

const displayAsides = AsidesArray.map((item) => (
  <li className="mb-2 sm:text-base md:text-lg md:mb-4 xl:text-xl xl:mb-6">
    <a href="#">
      <Icon
        lib={`${item.lib}`}
        name={`${item.icon}`}
        className="mr-2 xl:mr-6"
      />
      <span className="nompage xl:hidden">{item.namepage}</span>
    </a>
  </li>
));

const Aside = ({ isOpen }) => {
  return (
    <aside
      className={`${styles.aside} aside hidden xl:flex xl:w-1/20 `}
      id="aside"
    >
      <div className="xl:fixed xl:z-50 xl:left-0 xl:top-16">
        <ul className="aside-nav">{displayAsides}</ul>
      </div>
    </aside>
  );
};

export default Aside;
