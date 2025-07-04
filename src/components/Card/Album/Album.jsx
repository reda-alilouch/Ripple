"use client";
import Image from "next/image";
import Icon from "@/components/Icon";

const Album = ({ album, className = "" }) => {
  return (
    <div className={`album-card ${className}`}>
      <div className="album-image relative">
        <img
          src={album.image || "/default-album.jpg"}
          alt={`Pochette de ${album.name}`}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-album.jpg";
          }}
        />
        <div className="play-button absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Icon lib="fa-solid" name="fa-play" className="text-xl" />
        </div>
      </div>
      <h3 className="album-title font-semibold mt-2">
        {album?.name || "Album Title"}
      </h3>
      <p className="album-artist text-sm text-gray-600">
        {album?.artists?.[0]?.name || "Artist Name"}
      </p>
    </div>
  );
};

export default Album;
