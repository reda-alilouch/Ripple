"use client";
import { useTheme } from "next-themes";
import "./Darkmode.css"; // Changement du chemin pour un chemin relatif

const Darkmode = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mode" id="darkModeToggle">
      <input
        type="checkbox"
        className="checkbox btn"
        id="checkbox"
        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        checked={theme === "dark"}
      />
      <label
        htmlFor="checkbox"
        className="px-3 w-20 h-8 rounded-3xl border checkbox-label xl:w-24 xl:h-10 hover:shadow dark:hover:shadow-customdark"
      >
        <i className="text-black fa fa-moon dark:text-white"></i>
        <i className="text-black fa fa-sun dark:text-white"></i>
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default Darkmode;
