export function menuonclick(query) {
  var toggleButton = document.getElementById("aside-toggle");
  var aside = document.getElementById("aside");
  var nompage = document.getElementsByClassName("nompage");
  var btngrp = document.getElementById("btn-group");
  var main = document.getElementById("main");
  if (window.screen.width < 1280) {
    toggleButton.classList.toggle("bx-menu");
    toggleButton.classList.toggle("bx-x");
    aside.classList.toggle("active");
    main.classList.toggle("hidden");
    btngrp.classList.toggle("active");
  }
  if (window.screen.width >= 1280) {
    toggleButton.classList.toggle("bx-menu");
    toggleButton.classList.toggle("bx-x");
    nompage.classList.toggle("hidden");
    aside.classList.toggle("xl:w-1/4");
    aside.classList.toggle("xl:w-1/12");
  }
}
