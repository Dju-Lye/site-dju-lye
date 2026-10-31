// Animations GSAP du logo, uniquement quand le thème Halloween est actif.
// Détection : la feuille saisons/halloween.css est liée dans index.html (et non désactivée).
// Rien ne démarre si « sans-animation » est sur <html> (posée par animations.js : bouton ou
// « moins de mouvement ») ; tout passe par des tweens GSAP, donc par la pause globale.
(function () {
  var racine = document.documentElement;
  var demarre = false;

  // Décalage des yeux, en unités du logo (environ 2 px à l'écran)
  var VERS_LUNE = { x: 1.9, y: -1.2 };
  var VERS_CITROUILLE = { x: -1.8, y: -1.8 };
  var AU_CENTRE = { x: 0, y: 0 };

  function themeHalloweenActif() {
    var lien = document.querySelector('link[rel="stylesheet"][href$="saisons/halloween.css"]');
    return !!lien && !lien.disabled;
  }

  function animationsArretees() { return racine.classList.contains("sans-animation"); }

  function regarder(tl, yeux, cible, duree) {
    tl.to(yeux, { x: cible.x, y: cible.y, duration: duree, ease: "power2.inOut" });
  }

  // Une fois : trois petits bonds du symbole (translateY seulement), puis le sourire se trace.
  // Retourne l'instant où l'introduction se termine.
  function introduction(symbole, sourire) {
    var tl = gsap.timeline({ delay: 0.3 });
    tl.to(symbole, { y: -9, duration: 0.3, ease: "power2.out" })
      .to(symbole, { y: 0, duration: 1.1, ease: "bounce.out" });
    if (typeof DrawSVGPlugin !== "undefined") {
      gsap.set(sourire, { drawSVG: "0% 0%", visibility: "hidden" });
      tl.set(sourire, { visibility: "visible" }, "+=0.1")
        .to(sourire, { drawSVG: "0% 100%", duration: 1, ease: "power1.inOut" });
    }
    return tl.duration() + 0.3;
  }

  // Clignement lent, un toutes les 8 à 10 s (délais tirés au hasard une fois pour toutes)
  function clignement(yeux, delai) {
    var tl = gsap.timeline({ repeat: -1, delay: delai });
    for (var i = 0; i < 12; i++) {
      tl.to({}, { duration: gsap.utils.random(8, 10) })
        .to(yeux, { scaleY: 0.1, duration: 0.35, ease: "sine.in", transformOrigin: "50% 50%" })
        .to(yeux, { scaleY: 1, duration: 0.45, ease: "sine.out" });
    }
  }

  // Le regard va vers la lune (PC), puis vers la citrouille qui « répond » : le sourire s'élargit à peine
  function regardLuneEtCitrouille(tl, yeux, sourire, avecLune) {
    if (avecLune) {
      regarder(tl, yeux, VERS_LUNE, 0.9);
      tl.to({}, { duration: 2.2 });
    }
    regarder(tl, yeux, VERS_CITROUILLE, 0.8);
    tl.to(sourire, { scaleX: 1.06, duration: 0.7, ease: "sine.inOut", transformOrigin: "50% 50%" }, "+=0.3")
      .to(sourire, { scaleX: 1, duration: 0.7, ease: "sine.inOut" }, "+=1.2");
    regarder(tl, yeux, AU_CENTRE, 0.9);
    tl.to({}, { duration: 3 });
  }

  function demarrer() {
    var logo = document.querySelector(".accroche .logo");
    if (!logo) return;
    var symbole = logo.querySelector(".logo-symbole");
    var yeux = gsap.utils.toArray(logo.querySelectorAll(".logo-oeil"));
    var sourire = logo.querySelector(".logo-sourire");
    if (!symbole || yeux.length !== 2 || !sourire) return;

    if (typeof DrawSVGPlugin !== "undefined") gsap.registerPlugin(DrawSVGPlugin);
    logo.style.overflow = "visible"; // le symbole peut monter au-dessus de sa boîte pendant les bonds

    var apres = introduction(symbole, sourire);
    clignement(yeux, apres + 2);
    var avecLune = window.matchMedia("(min-width: 900px)").matches;
    var boucle = gsap.timeline({ repeat: -1, delay: apres + 0.5 });
    regardLuneEtCitrouille(boucle, yeux, sourire, avecLune);
  }

  function essayer() {
    if (demarre || animationsArretees()) return;
    demarre = true;
    demarrer();
  }

  if (typeof gsap === "undefined" || !themeHalloweenActif()) return;
  essayer();
  // Si les animations étaient arrêtées au chargement, elles démarrent quand le visiteur les reprend.
  if (!demarre) new MutationObserver(essayer).observe(racine, { attributes: true, attributeFilter: ["class"] });
})();
