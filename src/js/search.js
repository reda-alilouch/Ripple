export function searchonclick(query) {
  if (window.screen.width < 1280) {
    var search = document.getElementById("bar-search");
    var iconsearch = document.getElementById("icon-search");
    search.classList.toggle("hidden");
  }
}
