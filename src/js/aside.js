export const menuonclick = (query) => {
  const toggleButton = document.getElementById("aside-toggle");
  const aside = document.getElementById("aside");
  const nompage = document.getElementsByClassName("nompage");
  const btngrp = document.getElementById("btn-group");
  const main = document.getElementById("main");

  if (window.screen.width < 1280) {
    toggleButton.classList.toggle("bx-menu");
    toggleButton.classList.toggle("bx-x");
    aside.classList.toggle("hidden");
    main.classList.toggle("hidden");
    btngrp.classList.toggle("active");
  }

  if (window.screen.width >= 1280) {
    toggleButton.classList.toggle("bx-menu");
    toggleButton.classList.toggle("bx-x");
    for (let i = 0; i < nompage.length; i++) {
      nompage[i].classList.toggle("xl:hidden");
    }
    aside.classList.toggle("xl:w-2/12");
    aside.classList.toggle("xl:w-1/20");
  }
};
