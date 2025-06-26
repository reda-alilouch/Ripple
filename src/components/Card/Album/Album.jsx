"use client";
import Image from "next/image";
import Icon from "@/components/Icon";

const Album = ({ album, className = "" }) => {
  return (
    <div className={`album-card ${className}`}>
      <div className="album-image relative">
        <Image
          src={album?.images?.[0]?.url || "/placeholder-album.jpg"}
          alt={album?.name || "Album cover"}
          width={200}
          height={200}
          className="rounded-lg"
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
