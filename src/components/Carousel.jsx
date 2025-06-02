"use client";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Button from "@/components/Button";
import Image from "next/image";

const carouselItems = [
  {
    id: 1,
    title: "Découvrez de nouvelles musiques",
    description: "Explorez notre vaste collection de titres",
  },
  {
    id: 2,
    title: "Créez vos playlists",
    description: "Organisez votre musique comme vous le souhaitez",
  },
  {
    id: 3,
    title: "Écoutez partout",
    description: "Profitez de votre musique où que vous soyez",
  },
];

function Carousel() {
  return (
    <div className="splide" id="splide">
      <div className="splide__track">
        <ul className="splide__list">
          {carouselItems.map((item) => (
            <li key={item.id} className="splide__slide relative h-[300px]">
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
