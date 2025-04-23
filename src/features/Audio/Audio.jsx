"use client";
import "boxicons";
import styles from "@/features/Audio/Audio.module.css";
import Icon  from "@/components/Icon";
const Audio = () => (
  <div className="audio bottom-0 left-0 w-full z-50 fixed flex justify-between items-center py-5 px-3 bg-white">
    <div className="nom">
      <h3 className="mb-1">nom titre</h3>
      <a href="#">
        <h3>nom artiste</h3>
      </a>
    </div>
    <div className="audio1 flex gap-3 items-center  sm:gap-5">
      <a href="#">
        <i className=" fa-solid fa-repeat"></i>
      </a>
      <a href="#">
        <i className=" bx bx-skip-previous hidden sm:block"></i>
      </a>
      <a href="#">
        <i className=" fa-solid fa-pause"></i>
      </a>
      <a href="#">
        <Icon
          lib="bx"
          name="bx-skip-next"
          className="hidden sm:block"
        />
      </a>
      <a href="#">
        <i className=" fa-solid fa-shuffle"></i>
      </a>
    </div>
    <div className="timeic">
      <div className="time__audio flex items-center gap-3">
        <p>00:00/00:00</p>
        <a href="#">
          <i className=" fa-solid fa-ellipsis-vertical"></i>
        </a>
      </div>
    </div>
  </div>
);

export default Audio;
