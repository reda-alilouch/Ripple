"use client";

 const Genre = () => {
  return (
    <li className="splide__slide card-genre">
      <a href="#">
        <div className="genre w-full h-full relative">
          <img
            className="img-genre w-full h-full opacity-70 rounded"
            src="img/smartphone-coffee-music-objects.jpg"
          />
          <h3 className="h3-genre absolute bottom-1">nom genre</h3>
        </div>
      </a>
    </li>
  );
};
export default Genre;