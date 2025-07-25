"use client";
import styles from "@/features/Audio/Audio.module.css";
import Icon from "@/components/Icon";
import Image from "next/image";

const Audio = () => (
  <div
    className={`${styles.audio} audio bottom-0 left-0 w-full z-20 fixed flex justify-between items-center px-3 bg-white transition-colors duration-1000 dark:bg-slate-900 dark:text-white`}
  >
    <div className="flex items-center gap-3">
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
    <div className="audio__icon flex gap-3 items-center  sm:gap-5">
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
    <div className="timeic">
      <div className="time__audio flex items-center gap-3">
        <p>00:00/00:00</p>
        <a href="#">
          <Icon lib="fa-solid" name="fa-plus" className="!block " />
        </a>
      </div>
    </div>
  </div>
);

export default Audio;
