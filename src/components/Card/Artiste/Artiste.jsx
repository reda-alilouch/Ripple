"use client";
import styles from "./Artiste.module.css";

const Artiste = ({ artist, className = "" }) => {
  return (
    <div className={`card-artistes ${className}`}>
      <a href="#">
        <div className="h-32 artistes w-28">
          <Image
            className="object-cover w-full rounded-full img-artistes h-28"
            src={artist.image || "/default-artist.svg"}
            alt={`Photo de ${artist.name}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-artist.svg";
            }}
          />
          <h3 className="text-center h3-artistes">{artist.name}</h3>
        </div>
      </a>
    </div>
  );
};

export default Artiste;
