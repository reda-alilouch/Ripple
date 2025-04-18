
export function menuonclick(query) {
  if (window.screen.width < 1280) {
    const toggleButton = document.getElementById("aside-toggle");
    const sidebar = document.getElementById("aside");
    const btngrp = document.getElementById("btn-group");
    const main = document.getElementById("main");
    toggleButton.classList.toggle("bx-menu");
    toggleButton.classList.toggle("bx-x");
    sidebar.classList.toggle("active");
    main.classList.toggle("hidden");
    btngrp.classList.toggle("active");
  }
}