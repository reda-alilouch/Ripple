"use client";
import Carousel from "@/components/Carousel";
import Titre from "@/components/Card/Titre/Titre";
import Album from "@/components/Card/Album/Album";
import Artiste from "@/components/Card/Artiste/Artiste";
import Genre from "@/components/Card/Genre/Genre";
import "@splidejs/react-splide/css";
import { useState } from "react";

export default function Home() {
  return (
    <>
      <Carousel />

      <section className="section container">
        <div className="head pt-5 px-5">
          <h2 className="top font-bold">Top titres</h2>
        </div>
        <div className="song-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Titre />
          <Titre />
          <Titre />
          <Titre />
          <Titre className="hidden md:block" />
          <Titre className="hidden md:block" />
          <Titre className="hidden md:hidden lg:block" />
          <Titre className="hidden md:hidden lg:block" />
          <Titre className="hidden md:hidden lg:block" />
        </div>
      </section>
      <section className="section container px-5 pt-5">
        <div className="head flex justify-between items-center">
          <h2 className="top font-bold">Top albums</h2>
          <div className="voir-plus flex">
            <a href="#">
              <span className="voir">voir plus</span>

              <i className="fa-solid fa-arrow-right arrow-rotation"></i>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 justify-center mt-5 md:grid-cols-3 lg:grid-cols-4">
          <Album />
          <Album />
          <Album />
          <Album />
        </div>
      </section>
      <section className="section container px-5 pt-5 pb-5">
        <div className="head flex justify-between items-center mb-5">
          <h2 className="top font-bold">Top artistes</h2>
          <div className="voir-plus">
            <a href="#">
              <span className="#">voir plus</span>
              <i className="fa-solid fa-arrow-right arrow-rotation"></i>
            </a>
          </div>
        </div>
        <div
          id="cards-container"
          className="flex flex-wrap justify-center gap-7"
        >
          <Artiste />
          <Artiste />
          <Artiste />
          <Artiste />
          <Artiste className="lg:hidden" />
          <Artiste className="lg:hidden" />
          <Artiste className="hidden md:block" />
          <Artiste className="hidden md:block lg:hidden xl:block" />
        </div>
      </section>

      <section className="section container px-5 pt-5 pb-5">
        <div className="head flex justify-between items-center mb-5">
          <h2 className="top font-bold">Top genres</h2>
          <div className="voir-plus flex">
            <a href="#">
              <span className="voir">voir plus</span>
              <i className="fa-solid fa-arrow-right arrow-rotation"></i>
            </a>
          </div>
        </div>
        <div
          id="splide2"
          className="splide"
          aria-label="Splide Basic HTML Example"
        >
          <div className="splide__track">
            <ul className="splide__list flex gap-3">
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
              <Genre />
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
