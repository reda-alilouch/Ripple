export function searchonclick(query) {
  var logo = document.getElementById("logo");
  var search = document.getElementById("bar-search");
  var iconsearch = document.getElementById("icon-search");
  if (window.screen.width < 768) {
    search.classList.toggle("hidden");
    logo.classList.toggle("hidden");
    iconsearch.classList.toggle("fa-magnifying-glass");
    iconsearch.classList.toggle("fa-x");
  }
  if (window.screen.width >= 768) {
    search.classList.toggle("hidden");
    iconsearch.classList.toggle("fa-magnifying-glass");
    iconsearch.classList.toggle("fa-x");
  }
}
