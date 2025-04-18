function getMinPerSlide() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1200) return 6; // Breakpoint 2XL
  if (screenWidth >= 768) return 4; // Breakpoint XL
  if (screenWidth >= 500) return 3; // Breakpoint LG
  if (screenWidth >= 376) return 2; // Breakpoint MD
  return 1;
}

let splide1, splide2;

// Fonction d'initialisation des carrousels
function initSplide() {
  if (splide1) splide1.destroy(); // Détruire l'instance existante pour éviter les doublons
  if (splide2) splide2.destroy();

  splide1 = new Splide("#splide1", {
    type: "loop",
    autoplay: true,
    interval: 3000,
    snap: true,
  }).mount();

  splide2 = new Splide("#splide2", {
    type: "loop",
    pagination: false,
    perPage: getMinPerSlide(),
  }).mount();
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initSplide);
}

// Mise à jour dynamique lors du redimensionnement
export function setupSplide() {
  function initSplide() {
    // ... ici ton code pour initialiser Splide
    console.log("Splide initialisé");
  }

  initSplide();

  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSplide, 300);
  });
}
