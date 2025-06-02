"use client";
import Carousel from "@/components/Carousel";
import Titre from "@/components/Card/Titre/Titre";
import Album from "@/components/Card/Album/Album";
import Artiste from "@/components/Card/Artiste/Artiste";
import ListTrack from "@/components/CardList/TitreList";
import ListAlbum from "@/components/CardList/AlbumList";
import ListArtiste from "@/components/CardList/ArtisteList";

import "@splidejs/react-splide/css";



export default function Home() {
  return (
    <div className="container mx-auto">
      <Carousel />
      <ListTrack />
      <ListAlbum />
      <ListArtiste />

    </div>
  );
}
