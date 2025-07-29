"use client";
import Image from "next/image";
import Icon from "@/components/Icon";

const Album = ({ album, className = "" }) => {
  return (
    <div className={`album-card ${className}`}>
      <div className="relative album-image">
        <Image
          src={album.image || "/default-album.jpg"}
          alt={`Pochette de ${album.name}`}
          className="object-cover w-full h-full rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-album.jpg";
          }}
        />
        <div className="absolute transition-opacity duration-300 opacity-0 play-button right-2 bottom-2 group-hover:opacity-100">
          <Icon lib="fa-solid" name="fa-play" className="text-xl" />
        </div>
      </div>
      <h3 className="mt-2 font-semibold album-title">
        {album?.name || "Album Title"}
      </h3>
      <p className="text-sm text-gray-600 album-artist">
        {album?.artists?.[0]?.name || "Artist Name"}
      </p>
    </div>
  );
};

export default Album;
