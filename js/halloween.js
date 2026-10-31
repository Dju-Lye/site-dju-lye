// Animations GSAP du logo, uniquement quand le thème Halloween est actif.
// Détection : la feuille saisons/halloween.css est liée dans index.html (et non désactivée).
// Rien ne démarre si « sans-animation » est sur <html> (posée par animations.js : bouton ou
// « moins de mouvement ») ; tout passe par des tweens GSAP, donc par la pause globale.
(function () {
  var racine = document.documentElement;
  var demarre = false;
  var avecDessin = typeof DrawSVGPlugin !== "undefined";

  // Décalage des yeux, en unités du logo (environ 2 px à l'écran)
  var VERS_LUNE = { x: 1.9, y: -1.2 };
  var VERS_CITROUILLE = { x: -1.8, y: -1.8 };
  var AU_CENTRE = { x: 0, y: 0 };

  function themeHalloweenActif() {
    var lien = document.querySelector('link[rel="stylesheet"][href$="saisons/halloween.css"]');
    return !!lien && !lien.disabled;
  }

  function animationsArretees() { return racine.classList.contains("sans-animation"); }

  function regarder(tl, yeux, cible, duree, position, ease) {
    tl.to(yeux, { x: cible.x, y: cible.y, duration: duree, ease: ease || "power2.inOut" }, position);
  }

  // Une fois : trois petits bonds du symbole (translateY seulement), puis le sourire se trace.
  // Retourne l'instant où l'introduction se termine.
  function introduction(symbole, sourire) {
    var tl = gsap.timeline({ delay: 0.3 });
    tl.to(symbole, { y: -9, duration: 0.3, ease: "power2.out" })
      .to(symbole, { y: 0, duration: 1.1, ease: "bounce.out" });
    if (avecDessin) {
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

  // Trajets de la chauve-souris, en px depuis le coin haut-gauche du logo (PC) : du ciel jusqu'à
  // la gouttière au-dessus de l'écart carré / texte, hors citrouille, et retour.
  var DEPART = { x: 620, y: -36 };
  var POSE = { x: 77, y: -6 };
  var ALLER = [DEPART, { x: 450, y: -44 }, { x: 230, y: -30 }, POSE];
  var RETOUR = [POSE, { x: 200, y: -40 }, { x: 420, y: -44 }, { x: 620, y: -30 }];

  // Retourne la chauve-souris prête, ou null (mobile, plugin absent, balise absente)
  function preparerChauveSouris(avecLune) {
    var chauve = document.querySelector(".accroche .chauve-souris");
    if (!chauve || typeof MotionPathPlugin === "undefined") return null;
    if (!avecLune) return null;
    gsap.registerPlugin(MotionPathPlugin);
    gsap.set(chauve, { display: "block", autoAlpha: 0, xPercent: -50, yPercent: -100, x: DEPART.x, y: DEPART.y });
    return chauve;
  }

  function voler(tl, chauve, ailes, trajet, position) {
    tl.to(chauve, { motionPath: { path: trajet, curviness: 1.2 }, duration: 3.4, ease: "sine.inOut" }, position)
      .to(ailes, { scaleY: 0.5, duration: 0.34, repeat: 9, yoyo: true, ease: "sine.inOut", svgOrigin: "0 0" }, position);
  }

  // Un passage : arrive, se pose, repart. Les yeux la suivent, le sourire s'agrandit pendant qu'elle est là.
  function visiteChauveSouris(tl, yeux, sourire, chauve) {
    var ailes = chauve.querySelector(".chauve-souris-ailes");
    tl.set(chauve, { x: DEPART.x, y: DEPART.y, autoAlpha: 0 }, 0)
      .addLabel("arrivee", 0)
      .to(chauve, { autoAlpha: 1, duration: 0.5 }, "arrivee");
    voler(tl, chauve, ailes, ALLER, "arrivee");
    regarder(tl, yeux, VERS_LUNE, 0.6, "arrivee");
    regarder(tl, yeux, { x: 1, y: -2 }, 2.8, "arrivee+=0.6", "sine.inOut");
    tl.addLabel("pose", "arrivee+=3.4")
      .to(sourire, { scale: 1.1, duration: 0.6, ease: "sine.inOut", transformOrigin: "50% 50%" }, "pose")
      .addLabel("depart", "pose+=3.2")
      .to(sourire, { scale: 1, duration: 0.6, ease: "sine.inOut" }, "depart");
    voler(tl, chauve, ailes, RETOUR, "depart");
    tl.to(chauve, { autoAlpha: 0, duration: 0.5 }, "depart+=2.9");
    regarder(tl, yeux, VERS_LUNE, 3.4, "depart", "sine.inOut");
  }

  function demarrer() {
    var logo = document.querySelector(".accroche .logo");
    if (!logo) return;
    var symbole = logo.querySelector(".logo-symbole");
    var yeux = gsap.utils.toArray(logo.querySelectorAll(".logo-oeil"));
    var sourire = logo.querySelector(".logo-sourire");
    if (!symbole || yeux.length !== 2 || !sourire) return;

    if (avecDessin) gsap.registerPlugin(DrawSVGPlugin);
    logo.style.overflow = "visible"; // le symbole peut monter au-dessus de sa boîte pendant les bonds

    var apres = introduction(symbole, sourire);
    clignement(yeux, apres + 2);
    var avecLune = window.matchMedia("(min-width: 900px)").matches;
    var boucle = gsap.timeline({ repeat: -1, delay: apres + 0.5 });
    var chauve = preparerChauveSouris(avecLune);
    if (chauve) visiteChauveSouris(boucle, yeux, sourire, chauve);
    regardLuneEtCitrouille(boucle, yeux, sourire, avecLune);
  }

  var observateur = null;

  function essayer() {
    if (demarre || animationsArretees()) return;
    demarre = true;
    demarrer();
    if (observateur) observateur.disconnect();
  }

  if (typeof gsap === "undefined" || !themeHalloweenActif()) return;
  essayer();
  // Si les animations étaient arrêtées au chargement, elles démarrent quand le visiteur les reprend.
  if (!demarre) {
    observateur = new MutationObserver(essayer);
    observateur.observe(racine, { attributes: true, attributeFilter: ["class"] });
  }
})();
