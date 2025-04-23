"use client";

import styles from "@/components/Darkmode/Darkmode.module.css";


const Darkmode = () => {
  return (
    <div className={styles.mode}>
    <input type="checkbox" id="darkmode-toggle" className={styles.checkbox} />
    <label htmlFor="darkmode-toggle" className={styles["checkbox-label"]}>
      <span className={styles.ball}></span>
    </label>
  </div>
  );
};
export default Darkmode;

