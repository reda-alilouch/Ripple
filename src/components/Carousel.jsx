"use client";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";

function Carousel() {
  return (
    <div className="splide" id="splide">
      <div className="splide__track">
        <ul className="splide__list">
          <li className="splide__slide">Slide 1</li>
          <li className="splide__slide">Slide 2</li>
          <li className="splide__slide">Slide 3</li>
          <li className="splide__slide">Slide 4</li>
          <li className="splide__slide">Slide 5</li>
        </ul>
      </div>
    </div>
  );
}

export default Carousel;
