"use client";
import "./Darkmode.css"; // Changement du chemin pour un chemin relatif

const Darkmode = () => {
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="mode" id="darkModeToggle">
      <input
        type="checkbox"
        className="checkbox btn"
        id="checkbox"
        onClick={toggleTheme} // ← ✔ C'est ici que le toggle se fait
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
