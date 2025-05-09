"use client";
import styles from "./Titre.module.css";
import Icon from "@/components/Icon";

const Titre = ({ className = "", ...props }) => {
  return (
    <div className={` mr-5 mt-5 ms-5 pr-5 w-full ${className}`} {...props}>
      <div className={`${styles.titre} titre `}>
        <div className="img-h3 w-full">
          <a href="#">
            <div className="icon-play-img w-full">
              <img
                className="img-titre rounded-md"
                src="img/portrait-woman-singing-microphone.jpg"
              />
              <Icon lib="fa-solid" name="fa-play" className="my-icon" />
            </div>
          </a>
          <div className="h3 pl-2">
            <h3>nom song</h3>
            <h3>nom artiste</h3>
          </div>
        </div>
        <div className="icon-time gap-2">
          <p>03:00</p>
          <a href="#">
            <Icon lib="fa-solid" name="fa-plus" className="titre__icon" />
          </a>
          <a href="#">
            <Icon lib="fa-regular" name="fa-heart" className="titre__icon" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Titre;
