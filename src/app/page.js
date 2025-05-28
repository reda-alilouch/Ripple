"use client";
import Carousel from "@/src/components/Carousel";
import Titre from "@/src/components/Card/Titre/Titre";
import Album from "@/src/components/Card/Album/Album";
import Artiste from "@/src/components/Card/Artiste/Artiste";
import ListTrack from "@/src/components/CardList/TitreList";
import ListAlbum from "@/src/components/CardList/Albumlist";
import ListArtiste from "@/src/components/CardList/Artistelist";

import "@splidejs/react-splide/css";
import { useState } from "react";

export default function Home() {
  return (
    <>
      <Carousel />

      <ListTrack />
      <ListAlbum />
      <ListArtiste />

      <section className="section container px-5 pt-5 pb-5">
        <div className="head flex justify-between items-center mb-5">
          <h2 className="top font-bold">Top playlists</h2>
          <div className="voir-plus flex">
            <a href="#">
              <span className="voir">voir plus</span>
              <i className="fa-solid fa-arrow-right arrow-rotation"></i>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
