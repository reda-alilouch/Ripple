"use client";
import styles from "@/features/Audio/Audio.module.css";
import Icon from "@/components/Icon";
import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import AddTitre from "@/components/AddTitre/AddTitre";
const Audio = ({ tracks = [], playlistId }) => {
  const swiperRef = useRef(null);

  return (
    <div
      className={`${styles.audio} audio bottom-0 left-0 w-full z-20 fixed grid grid-rows-2 grid-cols-2 items-center px-3 sm:flex sm:justify-between bg-white transition-colors duration-1000 dark:bg-slate-900 dark:text-white`}
    >
      <div className="flex items-center gap-3 row-span-2 sm:row-span-1 justify-self-start">
        <Image
          src="/images/audio.png"
          alt="audio"
          className="rounded-md object-cover"
          width={70}
          height={70}
        />

        <div className="nom">
          <h3 className="mb-1">nom titre</h3>
          <a href="#">
            <h3>nom artiste</h3>
          </a>
        </div>
      </div>
      <div className="audio__icon flex gap-3 items-center sm:gap-5 justify-self-end">
        <a href="#">
          <Icon lib="fa-solid" name="fa-repeat" className="!block " />
        </a>
        <a href="#">
          <Icon
            lib="bx"
            name="bx-skip-previous"
            className=" !hidden text-3xl sm:!block"
          />
        </a>
        <a href="#">
          <Icon lib="fa-solid" name="fa-pause" className="!block " />
        </a>
        <a href="#">
          <Icon
            lib="bx"
            name="bx-skip-next"
            className=" !hidden text-3xl sm:!block"
          />
        </a>
        <a href="#">
          <Icon lib="fa-solid" name="fa-shuffle" className="!block " />
        </a>
      </div>
      <div className="timeic col-start-2 row-start-2 justify-self-end">
        <div className="time__audio flex items-center gap-3">
          <p>00:00/00:00</p>
        </div>
      </div>
      <div className="block lg:hidden">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={10}
          slidesPerView={1}
        >
          {tracks.length > 0 ? (
            tracks.map((track, idx) => (
              <SwiperSlide key={track.id || idx}>
                <div className="flex items-center gap-3">
                  <Image
                    src={track.image || "/images/audio.png"}
                    alt={track.name}
                    width={70}
                    height={70}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <h3>{track.name}</h3>
                    <h4>{track.artists?.[0]?.name || "Artiste inconnu"}</h4>
                    {track.preview_url && (
                      <audio
                        controls
                        src={track.preview_url}
                        className="mt-2"
                      />
                    )}
                    <AddTitre trackId={track._id} playlistId={playlistId} />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div>Aucun titre</div>
          )}
        </Swiper>
        {/* Boutons navigation tablette */}
        <div className="flex justify-between mt-2 sm:flex hidden">
          <button onClick={() => swiperRef.current.slidePrev()}>
            <Icon lib="bx" name="bx-skip-previous" className="text-3xl" />
          </button>
          <button onClick={() => swiperRef.current.slideNext()}>
            <Icon lib="bx" name="bx-skip-next" className="text-3xl" />
          </button>
        </div>
      </div>
      <div className="hidden lg:block">
        {/* Affichage desktop classique avec boutons */}
      </div>
    </div>
  );
};

export default Audio;
