"use client";
import styles from "./Artiste.module.css";

const Artiste = ({ artist, className = "" }) => {
  return (
    <div className={`card-artistes ${className}`}>
      <a href="#">
        <div className="artistes w-28 h-32">
          <img
            className="img-artistes w-full h-28 rounded-full object-cover"
            src={artist.image || "/default-artist.svg"}
            alt={`Photo de ${artist.name}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-artist.svg";
            }}
          />
          <h3 className="h3-artistes text-center">{artist.name}</h3>
        </div>
      </a>
    </div>
  );
};

export default Artiste;
