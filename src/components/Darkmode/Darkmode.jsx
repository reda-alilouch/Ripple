"use client";
import "@/components/Darkmode/Darkmode.css"; // si tu utilises ce fichier

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
        className="checkbox-label border px-3 rounded-3xl w-20 h-8 xl:w-24 xl:h-10 hover:shadow"
      >
        <i className="fa fa-moon dark:text-white"></i>
        <i className="fa fa-sun dark:text-white"></i>
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default Darkmode;
