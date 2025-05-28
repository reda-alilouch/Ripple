"use client";
import styles from "./Artiste.module.css";

const Artiste = ({ artist, className = "" }) => {
  

  return (
    <div className={`card-artistes ${className}`}>
      <a href="#">
        <div className="artistes w-28 h-32">
          <img
            className="img-artistes w-full h-28 rounded-full object-cover"
            src={artist.images?.[0]?.url || "/img/default-artist.jpg"}
            alt={artist.name}
          />
          <h3 className="h3-artistes text-center">{artist.name}</h3>
        </div>
      </a>
    </div>
  );
};

export default Artiste;
