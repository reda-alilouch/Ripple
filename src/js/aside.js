export const menuonclick = (query) => {
  const toggleButton = document.getElementById("aside-toggle");
  const aside = document.getElementById("aside");
  const nompage = document.getElementsByClassName("nompage");
  const btngrp = document.getElementById("btn-group");
  const main = document.getElementById("main");
  const searchbar = document.getElementById("searchbar");
  const logo = document.getElementById("logo");

  if (window.innerWidth < 1280) {
    toggleButton.classList.toggle("bx-menu");
    toggleButton.classList.toggle("bx-x");
    aside.classList.toggle("hidden");
    main.classList.toggle("hidden");
    btngrp.classList.toggle("hidden");
    searchbar.classList.toggle("hidden");
    logo.classList.toggle("hidden");
  }

  if (window.innerWidth >= 1280) {
    toggleButton.classList.toggle("bx-menu");
    toggleButton.classList.toggle("bx-x");
    for (let i = 0; i < nompage.length; i++) {
      nompage[i].classList.toggle("xl:hidden");
    }
    aside.classList.toggle("xl:w-2/12");
    aside.classList.toggle("xl:w-1/20");
  }
};

// Fonction pour gérer le redimensionnement
export const handleResize = () => {
  const aside = document.getElementById("aside");
  const main = document.getElementById("main");
  const btngrp = document.getElementById("btn-group");
  const searchbar = document.getElementById("searchbar");
  const logo = document.getElementById("logo");
  const nompage = document.getElementsByClassName("nompage");

  if (window.innerWidth >= 1280) {
    // Mode desktop - restaurer les éléments
    aside.classList.remove("hidden");
    main.classList.remove("hidden");
    btngrp.classList.remove("hidden");
    searchbar.classList.remove("hidden");
    logo.classList.remove("hidden");
  } else {
    // Mode mobile - cacher la sidebar si elle était ouverte
    const toggleButton = document.getElementById("aside-toggle");
    if (toggleButton.classList.contains("bx-x")) {
      // Si le menu était ouvert, le fermer
      toggleButton.classList.remove("bx-x");
      toggleButton.classList.add("bx-menu");
      aside.classList.add("hidden");
      main.classList.add("hidden");
      btngrp.classList.add("hidden");
      searchbar.classList.add("hidden");
      logo.classList.add("hidden");
    }
  }
};

// Ajouter l'écouteur d'événement resize
if (typeof window !== "undefined") {
  window.addEventListener("resize", handleResize);
}
