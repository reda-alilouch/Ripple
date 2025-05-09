import Carousel from "@/components/Carousel";
import Titre from "@/components/Card/Titre/Titre";

export default function Home() {
  return (
    <>
      <Carousel />

      <section className="section container">
        <div className="head pt-5 px-5">
          <h2 className="top font-bold">Top titres</h2>
        </div>
        <div className="song-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Titre />
          <Titre />
          <Titre />
          <Titre />
          <Titre className="hidden md:block"/>
          <Titre className="hidden md:block"/>
          <Titre className="hidden md:hidden lg:block"/> 
          <Titre className="hidden md:hidden lg:block"/>
          <Titre className="hidden md:hidden lg:block"/>
        </div>
      </section>
    </>
  );
}
