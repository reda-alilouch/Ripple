"use client";
import styles from "./Artiste.module.css";

const Artiste = ({ className = "", ...props }) => {
  return (
    <div className={`card-artistes ${className}`} {...props}>
      <a href="#">
        <div className={`${styles.artistes} artistes w-28 h-32`}>
          <img
            className="img-artistes w-full h-28 rounded-full"
            src="img/portrait-woman-singing-microphone.jpg"
          />
          <h3 className="h3-artistes">nom artiste</h3>
        </div>
      </a>
    </div>
  );
};
export default Artiste;
