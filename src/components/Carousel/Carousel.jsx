"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";

function Carousel() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch("/api/banner")
      .then((res) => res.json())
      .then(setBanners);
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      new Splide("#splide", {
        type: "loop",
        perPage: 1,
        autoplay: true,
      }).mount();
    }
  }, [banners]);

  return (
    <div className="splide" id="splide">
      <div className="splide__track">
        <ul className="splide__list">
          {banners.map((item) => (
            <li key={item._id} className="splide__slide relative h-[300px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20">
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-4">
                  <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
                  <p className="text-lg mb-4">{item.description}</p>
                  <Button className="bg-white text-primary hover:bg-gray-100">
                    En savoir plus
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Carousel;
