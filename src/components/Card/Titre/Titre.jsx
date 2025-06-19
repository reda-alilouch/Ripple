// src/components/Titre.jsx
"use client";
import styles from "./Titre.module.css";
import Icon from "@/components/Icon";


const Titre = ({ track, className = "" }) => {
  if (!track) return null;

  const handlePlay = () => {
    console.log("Lecture de:", track.name, "par", track.artists[0]?.name);
  };

  const handleAddToPlaylist = () => {
    console.log("Ajout à la playlist:", track.name);
  };

  const handleLike = () => {
    console.log("Like pour:", track.name);
  };

  return (
    <div className={`mr-5 mt-5 ms-5 pr-5 w-full ${className}`}>
      <div className={`${styles.titre} titre`}>
        <div className="img-h3 w-full flex items-center">
          <a href="#" onClick={handlePlay}>
            <div className="">
              <img
                className="img-titre rounded-md  object-cover"
                src={track.album?.images[0]?.url}
                alt={track.name}
              />
             
            </div>
          </a>
          <div className="h3 pl-2">
            <h3 className="font-medium">{track.name}</h3>
            <a href=""><h3 className="text-sm text-gray-500">{track.artists[0]?.name}</h3></a>
          </div>
        </div>
        <div className="icon-time flex items-center gap-2">
          <p>{track.duration_ms}</p>
          <button onClick={handleAddToPlaylist}>
            <Icon lib="fa-solid" name="fa-plus" className="titre__icon" />
          </button>
          <button onClick={handleLike}>
            <Icon lib="fa-regular" name="fa-heart" className="titre__icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Titre;
