"use client";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Button from "@/src/components/Button";

function Carousel() {
  return (
    <div className="splide" id="splide">
      <div className="splide__track">
        <ul className="splide__list">
          <li className="splide__slide">
            <img src="img/carousel.jpg" alt="" />
            <h2 className="text-center"></h2>
            <p className="text-center"></p>
            <Button />
          </li>
          <li className="splide__slide">
            <img src="img/carousel.jpg" alt="" />
            <h2 className="text-center"></h2>
            <p className="text-center"></p>
            <Button />
          </li>
          <li className="splide__slide">
            <img src="img/carousel.jpg" alt="" />
            <h2 className="text-center"></h2>
            <p className="text-center"></p>
            <Button />
          </li>
          <li className="splide__slide">
            <img src="img/carousel.jpg" alt="" />
            <h2 className="text-center"></h2>
            <p className="text-center"></p>
            <Button />
          </li>
          <li className="splide__slide">
            <img src="img/carousel.jpg" alt="" />
            <h2 className="text-center"></h2>
            <p className="text-center"></p>
            <Button />
          </li>
          <li className="splide__slide">
            <img src="img/carousel.jpg" alt="" />
            <h2 className="text-center"></h2>
            <p className="text-center"></p>
            <Button />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Carousel;
