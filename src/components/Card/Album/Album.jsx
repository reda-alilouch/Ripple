"use client";

import Link from "next/link";

export default function Album({ album, className = "", ...props }) {
  if (!album) return null;

  const albumId = album.id;
  const artist = album.artists?.[0];
  const artistId = artist?.id;
  const artistName = artist?.name || "Inconnu";

  return (
    <div className={`card-album rounded relative ${className}`} {...props}>
      <Link href={`/album/${albumId}`}>
        <img
          className="album-img rounded w-full h-full object-cover opacity-70"
          src={album.images?.[0]?.url || "/placeholder.jpg"}
          alt={album.name}
        />
      </Link>

      <div className="icon-album absolute top-0 right-0 flex gap-2 p-2 opacity-0 hover:opacity-100 transition-all duration-300">
        <Link href={`/album/${albumId}`}>
          <i className="icon fa-solid fa-circle-play"></i>
        </Link>
      </div>

      <div className="h3-album absolute bottom-0 px-2 py-1 bg-black bg-opacity-50 w-full">
        <h3 className="text-base text-white truncate">{album.name}</h3>
        {artistId ? (
          <Link href={`/artist/${artistId}`}>
            <h4 className="text-sm text-gray-300 hover:underline">
              {artistName}
            </h4>
          </Link>
        ) : (
          <h4 className="text-sm text-gray-400 italic">Artiste inconnu</h4>
        )}
      </div>
    </div>
  );
}
