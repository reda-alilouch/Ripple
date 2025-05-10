"use client";

import Icon from "@/components/Icon";

const Album = ({ className = "", ...props }) => {
  return (
    <div className={`card-album rounded relative ${className}`} {...props}>
      <a href="#">
        <img
          className="album-img rounded w-full h-full opacity-70"
          src="img/smartphone-coffee-music-objects.jpg"
        />
      </a>
      <div className="icon-album hidden t-0">
        <a href="#">
          <i className="icon fa-solid fa-circle-play"></i>
        </a>
        <a href="#">
          <i className="icon fa-solid fa-heart"></i>
        </a>
      </div>
      <div className="h3-album absolute bottom-0 px-1">
        <h3 className="text-base">nom album</h3>
        <a href="#">
          <h3 className="text-base">nom artiste</h3>
        </a>
      </div>
    </div>
  );
};
export default Album;