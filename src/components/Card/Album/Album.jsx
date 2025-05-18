"use client";

const Album = ({ album, className = "", ...props }) => {
  return (
    <div className={`card-album rounded relative ${className}`} {...props}>
      <a href="#">
        <img
          className="album-img rounded w-full h-full opacity-70"
          src="img/album.jpg"
          alt=""
        />
      </a>
      <div className="icon-album absolute top-0 right-0 flex gap-2 p-2 opacity-0 hover:opacity-100 transition-all duration-300">  
        <a href="#">
          <i className="icon fa-solid fa-circle-play"></i>
        </a>
        
      </div>
      <div className="h3-album absolute bottom-0 px-2 py-1 bg-black bg-opacity-50 w-full">
        <h3 className="text-base text-white"></h3>
        <a href="#">
          <h4 className="text-sm text-gray-300">
            
          </h4>
        </a>
      </div>
    </div>
  );
};

export default Album;
