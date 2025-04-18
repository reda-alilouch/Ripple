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
  <div className="mb-2 sm:text-base md:text-lg md:mb-4 xl:text-xl">
    <a href="#">
      <Icon lib={`${item.lib}`} name={`${item.icon}`} className="mr-2" />
      <span>{item.namepage}</span>
    </a>
  </div>
));

const Aside = ({ isOpen }) => {
  return (
    <aside
      className={`${styles.aside} aside xl:flex xl:w-1/4 `}
      id="aside"
    >
      <div className="p-4 flex items-center xl:w-full xl:fixed xl:left-0">
        <div className="aside-nav xl:w-full">{displayAsides}</div>
      </div>
    </aside>
  );
};

export default Aside;
