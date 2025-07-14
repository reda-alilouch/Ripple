"use client";
import Carousel from "@/components/Carousel/Carousel";

import ListTrack from "@/components/CardList/TitreList";
import ListAlbum from "@/components/CardList/AlbumList";
import ListArtiste from "@/components/CardList/ArtisteList";
import PlaylistList from "@/components/CardList/PlaylistList";

import "@splidejs/react-splide/css";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Carousel />
      <ListTrack />
      <ListAlbum />
      <ListArtiste />
      <PlaylistList playlist={PlaylistList} />
    </div>
  );
}
