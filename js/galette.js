// Animations GSAP du logo, uniquement quand le thème La galette est actif.
// Détection : la feuille saisons/galette.css est liée dans index.html (et non désactivée).
// Rien ne démarre si « sans-animation » est sur <html> (posée par animations.js : bouton ou
// « moins de mouvement ») ; tout passe par des tweens GSAP, donc par la pause globale.
// La partie logo (introduction, clignement, mesures) est copiée de js/lumieres-decembre.js (lui-même copié de halloween.js).
(function () {
  var racine = document.documentElement;
  var demarre = false;
  var avecDessin = typeof DrawSVGPlugin !== "undefined";

  // Décalage des yeux, en unités du logo (environ 2 px à l'écran)
  var VERS_PART = { x: -0.8, y: -2 };
  var AU_CENTRE = { x: 0, y: 0 };

  // La fève cachée touche la couronne du ciel (.accroche .contenu::before : coin haut droit, 34 rem sur 7 rem, repère 340 x 70).
  // Position de son centre dans ce repère (la couronne est centrée en x = 292, y = 36) ; 1 unité = 0,1 rem.
  var FEVE = { x: 258, y: 44, taille: 44 };

  var NS = "http://www.w3.org/2000/svg";

  function themeActif() {
    var lien = document.querySelector('link[rel="stylesheet"][href$="saisons/galette.css"]');
    return !!lien && !lien.disabled;
  }

  // Le sourire est masqué par le CSS (classe posée dans le <head>) en attendant son tracé : on rend la main
  // à GSAP, ou on rend le sourire visible si rien ne démarre.
  function rendreLeSourire() { racine.classList.remove("sourire-attendu"); }

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

  // Le regard monte vers la part de galette du logo, qui « répond » : le sourire s'élargit à peine
  function regardPart(tl, yeux, sourire) {
    regarder(tl, yeux, VERS_PART, 0.8);
    tl.to(sourire, { scaleX: 1.06, duration: 0.7, ease: "sine.inOut", transformOrigin: "50% 50%" }, "+=0.3")
      .to(sourire, { scaleX: 1, duration: 0.7, ease: "sine.inOut" }, "+=1.2");
    regarder(tl, yeux, AU_CENTRE, 0.9);
    tl.to({}, { duration: 3 });
  }

  function creer(nom, attributs, parent) {
    var element = document.createElementNS(NS, nom);
    for (var cle in attributs) element.setAttribute(cle, attributs[cle]);
    if (parent) parent.appendChild(element);
    return element;
  }

  // SVG en ligne, caché par défaut : fève ronde miel (44 px) avec visage aubergine, comme celle de « Écrire à Julie ».
  function creerFeve(parent) {
    var svg = creer("svg", {
      "class": "feve-cachee", "aria-hidden": "true", focusable: "false",
      viewBox: "0 0 48 48", width: FEVE.taille, height: FEVE.taille, style: "display:none"
    }, parent);
    creer("ellipse", {
      cx: 24, cy: 25, rx: 19, ry: 17, fill: "#f5c33b", stroke: "#ffffff", "stroke-width": 1.5,
      "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke"
    }, svg);
    [18.5, 29.5].forEach(function (x) { creer("circle", { cx: x, cy: 23, r: 2.2, fill: "#4a2a6e" }, svg); });
    creer("path", {
      d: "M18.5 28.5 Q24 33.5 29.5 28.5", fill: "none", stroke: "#4a2a6e", "stroke-width": 2.4, "stroke-linecap": "round"
    }, svg);
    return svg;
  }

  // Position de la fève (px depuis le coin haut-gauche du .contenu), calculée sur le ciel du CSS (rem du document)
  function positionFeve(contenu) {
    var rem = parseFloat(getComputedStyle(racine).fontSize);
    return { x: contenu.clientWidth - 36 * rem + FEVE.x * rem / 10, y: rem + FEVE.y * rem / 10, glisse: FEVE.taille * 0.28 };
  }

  // Cycle d'environ 19 s : la fève apparaît en fondu et sourit, glisse un peu derrière la couronne en s'effaçant, reste
  // cachée, puis revient (opacité et glissement très lents, aucun clignotement).
  function cycleFeve(feve, pos) {
    var tl = gsap.timeline({ repeat: -1 });
    tl.set(feve, { x: pos.x, y: pos.y, autoAlpha: 0 })
      .to(feve, { autoAlpha: 1, duration: 2.5, ease: "sine.inOut" })
      .to({}, { duration: 5 })
      .to(feve, { autoAlpha: 0, x: pos.x + pos.glisse, duration: 3, ease: "sine.inOut" })
      .to({}, { duration: 8.5 });
    return tl;
  }

  function demarrer() {
    rendreLeSourire(); // sans tracé, le sourire reste visible ; sinon l'introduction le recache aussitôt (même passage synchrone)
    var logo = document.querySelector(".accroche .logo");
    if (!logo) return;
    var symbole = logo.querySelector(".logo-symbole");
    var yeux = gsap.utils.toArray(logo.querySelectorAll(".logo-oeil"));
    var sourire = logo.querySelector(".logo-sourire");
    if (!symbole || yeux.length !== 2 || !sourire) return;

    if (avecDessin) gsap.registerPlugin(DrawSVGPlugin);
    logo.style.overflow = "visible"; // le symbole peut monter au-dessus de sa boîte pendant les bonds
    var feve = creerFeve(logo.parentNode);

    var debut = gsap.globalTimeline.time();
    var apres = introduction(symbole, sourire);
    clignement(yeux, apres + 2);
    departBoucle = debut + apres + 0.5;
    monterBoucle(logo, yeux, sourire, feve);
    // La fenêtre change de taille : on remesure et on recrée la boucle.
    var minuteur = null;
    window.addEventListener("resize", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(function () { monterBoucle(logo, yeux, sourire, feve); }, 150);
    });
  }

  // Les regards sont recréés selon la largeur ; la fève cachée n'existe qu'à partir de 900 px.
  // Le nettoyage (revert) rend yeux, sourire et fève à leur état d'origine.
  var largeurs = null;
  var departBoucle = 0;
  function monterBoucle(logo, yeux, sourire, feve) {
    if (largeurs) largeurs.kill(true);
    var delai = Math.max(0.3, departBoucle - gsap.globalTimeline.time());
    largeurs = gsap.matchMedia();
    largeurs.add({ pc: "(min-width: 900px)" }, function (contexte) {
      var regards = gsap.timeline({ repeat: -1, delay: delai });
      regardPart(regards, yeux, sourire);
      if (!contexte.conditions.pc) return;
      gsap.set(feve, { display: "block", autoAlpha: 0, xPercent: -50, yPercent: -50 });
      cycleFeve(feve, positionFeve(logo.parentNode)).delay(delai + 2);
    });
  }

  var observateur = null;

  function essayer() {
    if (demarre) return;
    if (animationsArretees()) return rendreLeSourire();
    demarre = true;
    demarrer();
    if (observateur) observateur.disconnect();
  }

  if (typeof gsap === "undefined" || !themeActif()) return rendreLeSourire();
  essayer();
  // Si les animations étaient arrêtées au chargement, elles démarrent quand le visiteur les reprend.
  if (!demarre) {
    observateur = new MutationObserver(essayer);
    observateur.observe(racine, { attributes: true, attributeFilter: ["class"] });
  }
})();
