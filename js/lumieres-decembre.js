// Animations GSAP du logo, uniquement quand le thème Lumières de décembre est actif.
// Détection : la feuille saisons/lumieres-decembre.css est liée dans index.html (et non désactivée).
// Rien ne démarre si « sans-animation » est sur <html> (posée par animations.js : bouton ou
// « moins de mouvement ») ; tout passe par des tweens GSAP, donc par la pause globale.
// La partie logo (introduction, clignement, mesures) est copiée de js/halloween.js : la factoriser
// obligerait à changer index.html et halloween.js pendant qu'Halloween est en ligne.
(function () {
  var racine = document.documentElement;
  var demarre = false;
  var avecDessin = typeof DrawSVGPlugin !== "undefined";
  var PERIODE = 40; // secondes entre deux passages de l'étoile filante

  // Décalage des yeux, en unités du logo (environ 2 px à l'écran)
  var VERS_ETOILE = { x: -0.8, y: -2 };
  var VERS_DROITE = { x: 2, y: -0.6 };
  var DROIT_DEVANT = { x: 2.2, y: 0 };
  var AU_CENTRE = { x: 0, y: 0 };

  var NS = "http://www.w3.org/2000/svg";
  var ETOILE = "M-2.6 -16.5Q0 -21 2.6 -16.5L5.6 -11.4Q6.8 -9.3 9.1 -8.8L14.9 -7.6Q20 -6.5 16.5 -2.6L12.5 1.8Q10.9 3.6 11.2 5.9L11.8 11.8Q12.3 17 7.6 14.9L2.2 12.5Q0 11.5 -2.2 12.5L-7.6 14.9Q-12.3 17 -11.8 11.8L-11.2 5.9Q-10.9 3.6 -12.5 1.8L-16.5 -2.6Q-20 -6.5 -14.9 -7.6L-9.1 -8.8Q-6.8 -9.3 -5.6 -11.4Z";

  function themeActif() {
    var lien = document.querySelector('link[rel="stylesheet"][href$="saisons/lumieres-decembre.css"]');
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

  // Le regard monte vers l'étoile du logo, qui « répond » : le sourire s'élargit à peine
  function regardEtoile(tl, yeux, sourire) {
    regarder(tl, yeux, VERS_ETOILE, 0.8);
    tl.to(sourire, { scaleX: 1.06, duration: 0.7, ease: "sine.inOut", transformOrigin: "50% 50%" }, "+=0.3")
      .to(sourire, { scaleX: 1, duration: 0.7, ease: "sine.inOut" }, "+=1.2");
    regarder(tl, yeux, AU_CENTRE, 0.9);
    tl.to({}, { duration: 3 });
  }

  // Mesures du logo à l'écran, en px depuis le coin haut-gauche de son conteneur (le .contenu) :
  // bord droit du logo, milieu vertical, hauteur du symbole (zone de protection de la charte).
  function mesurerLogo(logo, symbole) {
    var base = logo.parentNode.getBoundingClientRect();
    var boite = logo.getBoundingClientRect();
    return {
      droite: boite.right - base.left,
      milieu: boite.top + boite.height / 2 - base.top,
      hauteur: symbole.getBoundingClientRect().height
    };
  }

  // Trajets de l'étoile filante, tout en multiples de la hauteur h du symbole : elle se pose à droite du
  // logo, à h/2 de lui, et ne vole que dans l'espace libre entre le logo et le texte
  // (jamais plus haut que le milieu du logo : le ciel du haut appartient au décor).
  function calculerTrajets(mesure, largeur) {
    var h = mesure.hauteur;
    var pose = { x: mesure.droite + h / 2 + largeur / 2, y: mesure.milieu };
    function point(dx, dy) { return { x: pose.x + dx * h, y: pose.y + dy * h }; }
    return {
      aller: [point(5, 0.45), point(3.2, 0.55), point(1.6, 0.3), pose],
      retour: [pose, point(1.4, 0.5), point(3.2, 0.6), point(5, 0.35)]
    };
  }

  function creer(nom, attributs, parent) {
    var element = document.createElementNS(NS, nom);
    for (var cle in attributs) element.setAttribute(cle, attributs[cle]);
    if (parent) parent.appendChild(element);
    return element;
  }

  // SVG en ligne, caché par défaut : étoile miel de 28 px (sans visage, moins de 40 px) et queue de ronds qui s'effacent.
  // La tête est à gauche (elle avance vers la gauche), la queue à droite.
  function creerEtoileFilante(parent) {
    var svg = creer("svg", {
      "class": "etoile-filante", "aria-hidden": "true", focusable: "false",
      viewBox: "-28 -14 56 28", width: 56, height: 28, style: "display:none"
    }, parent);
    var queue = creer("g", { "class": "etoile-filante-queue", fill: "#f5c33b" }, svg);
    [[5, 4.5, 0.8], [12, 3.4, 0.6], [18.5, 2.5, 0.4], [24.5, 1.7, 0.25]].forEach(function (p) {
      creer("circle", { cx: p[0], cy: 0, r: p[1], opacity: p[2] }, queue);
    });
    var tete = creer("g", { transform: "translate(-14 0) scale(.667)" }, svg);
    creer("path", {
      d: ETOILE, fill: "#f5c33b", stroke: "#ffffff", "stroke-width": 1.5,
      "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke"
    }, tete);
    return svg;
  }

  // Retourne l'étoile filante prête et ses trajets, ou null (plugin absent)
  function preparerEtoileFilante(etoile, logo, symbole) {
    if (!etoile || typeof MotionPathPlugin === "undefined") return null;
    gsap.registerPlugin(MotionPathPlugin);
    gsap.set(etoile, { display: "block", autoAlpha: 0, xPercent: -50, yPercent: -50 });
    var trajets = calculerTrajets(mesurerLogo(logo, symbole), etoile.getBoundingClientRect().width);
    return { etoile: etoile, trajets: trajets };
  }

  function voler(tl, etoile, trajet, position) {
    tl.to(etoile, { motionPath: { path: trajet, curviness: 1.2 }, duration: 4, ease: "sine.inOut" }, position);
  }

  // Un passage : arrive de la droite, se pose, repart. Les yeux la suivent, le sourire s'agrandit pendant qu'elle est là.
  // À l'arrêt, la queue se raccourcit ; au départ, l'étoile se retourne (la queue reste derrière elle).
  function visiteEtoileFilante(tl, yeux, sourire, visiteuse) {
    var etoile = visiteuse.etoile;
    var trajets = visiteuse.trajets;
    var queue = etoile.querySelector(".etoile-filante-queue");
    tl.set(etoile, { x: trajets.aller[0].x, y: trajets.aller[0].y, autoAlpha: 0, scaleX: 1 }, 0)
      .addLabel("arrivee", 0)
      .to(etoile, { autoAlpha: 1, duration: 0.8 }, "arrivee");
    voler(tl, etoile, trajets.aller, "arrivee");
    regarder(tl, yeux, VERS_DROITE, 1, "arrivee");
    tl.addLabel("pose", "arrivee+=4")
      .to(queue, { scaleX: 0.3, duration: 0.8, ease: "sine.inOut", svgOrigin: "-14 0" }, "pose-=0.8");
    regarder(tl, yeux, DROIT_DEVANT, 1.2, "pose-=1");
    tl.to(sourire, { scale: 1.1, duration: 0.6, ease: "sine.inOut", transformOrigin: "50% 50%" }, "pose")
      .addLabel("depart", "pose+=3.2")
      .to(sourire, { scale: 1, duration: 0.6, ease: "sine.inOut" }, "depart")
      .set(etoile, { scaleX: -1 }, "depart")
      .to(queue, { scaleX: 1, duration: 1.2, ease: "sine.inOut", svgOrigin: "-14 0" }, "depart");
    voler(tl, etoile, trajets.retour, "depart");
    tl.to(etoile, { autoAlpha: 0, duration: 0.8 }, "depart+=3.2");
    regarder(tl, yeux, VERS_DROITE, 4, "depart", "sine.inOut");
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
    var etoile = creerEtoileFilante(logo.parentNode);

    var debut = gsap.globalTimeline.time();
    var apres = introduction(symbole, sourire);
    clignement(yeux, apres + 2);
    departBoucle = debut + apres + 0.5;
    monterBoucle(logo, symbole, yeux, sourire, etoile);
    // Le logo change de taille avec la fenêtre ou le zoom : on remesure et on recrée la boucle.
    var minuteur = null;
    window.addEventListener("resize", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(function () { monterBoucle(logo, symbole, yeux, sourire, etoile); }, 150);
    });
  }

  // La boucle (regards, visite de l'étoile filante) est recréée selon la largeur : étoile filante seulement
  // à partir de 900 px. Le nettoyage (revert) rend yeux, sourire et étoile à leur état d'origine.
  // Au redimensionnement, la boucle garde l'instant de départ prévu : la visite ne coupe pas l'introduction.
  var largeurs = null;
  var departBoucle = 0;
  function monterBoucle(logo, symbole, yeux, sourire, etoile) {
    if (largeurs) largeurs.kill(true);
    var delai = Math.max(0.3, departBoucle - gsap.globalTimeline.time());
    largeurs = gsap.matchMedia();
    largeurs.add({ pc: "(min-width: 900px)" }, function (contexte) {
      var boucle = gsap.timeline({ repeat: -1, delay: delai });
      var visiteuse = contexte.conditions.pc ? preparerEtoileFilante(etoile, logo, symbole) : null;
      if (visiteuse) visiteEtoileFilante(boucle, yeux, sourire, visiteuse);
      regardEtoile(boucle, yeux, sourire);
      if (visiteuse) boucle.to({}, { duration: Math.max(0, PERIODE - boucle.duration()) }); // un passage toutes les 40 s environ
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
