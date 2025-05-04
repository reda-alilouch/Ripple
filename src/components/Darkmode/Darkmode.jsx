"use client";
import styles from "@/components/Darkmode/Darkmode.css";

const Darkmode = () => {
  return (
    <div className="mode" id="darkModeToggle">
      <input type="checkbox" className="checkbox btn" id="checkbox" />
      <label
        htmlFor="checkbox"
        className="checkbox-label border px-3 rounded-3xl w-20 h-8 xl:w-24 xl:h-10 hover:shadow"
      >
        <i className="fa fa-moon"></i>
        <i className="fa fa-sun"></i>
        <span className="ball"></span>
      </label>
    </div>
  );
};
export default Darkmode;
