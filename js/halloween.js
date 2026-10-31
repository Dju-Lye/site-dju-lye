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

  // Trajets de la visiteuse, tout en multiples de la hauteur h du symbole : elle se pose à droite du
  // logo, à h/2 de lui, et ne vole que dans l'espace libre entre le logo, la lune et le texte
  // (jamais plus haut que le milieu du logo : le ciel du haut appartient au décor).
  function calculerTrajets(mesure, largeurVisiteuse) {
    var h = mesure.hauteur;
    var pose = { x: mesure.droite + h / 2 + largeurVisiteuse / 2, y: mesure.milieu };
    function point(dx, dy) { return { x: pose.x + dx * h, y: pose.y + dy * h }; }
    return {
      depart: point(5, 0.45),
      aller: [point(5, 0.45), point(3.2, 0.55), point(1.6, 0.3), pose],
      retour: [pose, point(1.4, 0.5), point(3.2, 0.6), point(5, 0.35)]
    };
  }

  // Retourne la visiteuse prête et ses trajets, ou null (plugin absent, balise absente)
  function preparerChauveSouris(logo, symbole) {
    var chauve = document.querySelector(".accroche .chauve-souris");
    if (!chauve || typeof MotionPathPlugin === "undefined") return null;
    gsap.registerPlugin(MotionPathPlugin);
    gsap.set(chauve, { display: "block", autoAlpha: 0, xPercent: -50, yPercent: -50 });
    var trajets = calculerTrajets(mesurerLogo(logo, symbole), chauve.getBoundingClientRect().width);
    gsap.set(chauve, { x: trajets.depart.x, y: trajets.depart.y });
    return { chauve: chauve, trajets: trajets };
  }

  function voler(tl, chauve, ailes, trajet, position) {
    tl.to(chauve, { motionPath: { path: trajet, curviness: 1.2 }, duration: 3.4, ease: "sine.inOut" }, position)
      .to(ailes, { scaleY: 0.5, duration: 0.34, repeat: 9, yoyo: true, ease: "sine.inOut", svgOrigin: "0 0" }, position);
  }

  // Un passage : arrive, se pose, repart. Les yeux la suivent, le sourire s'agrandit pendant qu'elle est là.
  function visiteChauveSouris(tl, yeux, sourire, visiteuse) {
    var chauve = visiteuse.chauve;
    var trajets = visiteuse.trajets;
    var ailes = chauve.querySelector(".chauve-souris-ailes");
    tl.set(chauve, { x: trajets.depart.x, y: trajets.depart.y, autoAlpha: 0 }, 0)
      .addLabel("arrivee", 0)
      .to(chauve, { autoAlpha: 1, duration: 0.5 }, "arrivee");
    voler(tl, chauve, ailes, trajets.aller, "arrivee");
    regarder(tl, yeux, VERS_LUNE, 0.6, "arrivee");
    regarder(tl, yeux, { x: 1, y: -2 }, 2.8, "arrivee+=0.6", "sine.inOut");
    tl.addLabel("pose", "arrivee+=3.4")
      .to(sourire, { scale: 1.1, duration: 0.6, ease: "sine.inOut", transformOrigin: "50% 50%" }, "pose")
      .addLabel("depart", "pose+=3.2")
      .to(sourire, { scale: 1, duration: 0.6, ease: "sine.inOut" }, "depart");
    voler(tl, chauve, ailes, trajets.retour, "depart");
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

    var debut = gsap.globalTimeline.time();
    var apres = introduction(symbole, sourire);
    clignement(yeux, apres + 2);
    monterBoucle(logo, symbole, yeux, sourire, debut + apres + 0.5);
    // Le logo change de taille avec la fenêtre ou le zoom : on remesure et on recrée la boucle.
    var minuteur = null;
    window.addEventListener("resize", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(function () { monterBoucle(logo, symbole, yeux, sourire, 0); }, 150);
    });
  }

  // La boucle (regards, visite de la visiteuse) est recréée selon la largeur : visiteuse seulement
  // à partir de 900 px. Le nettoyage (revert) rend yeux, sourire et visiteuse à leur état d'origine.
  var largeurs = null;
  function monterBoucle(logo, symbole, yeux, sourire, instantDepart) {
    if (largeurs) largeurs.kill(true);
    var delai = Math.max(0.3, instantDepart - gsap.globalTimeline.time());
    largeurs = gsap.matchMedia();
    largeurs.add({ pc: "(min-width: 900px)" }, function (contexte) {
      var avecLune = contexte.conditions.pc;
      var boucle = gsap.timeline({ repeat: -1, delay: delai });
      var visiteuse = avecLune ? preparerChauveSouris(logo, symbole) : null;
      if (visiteuse) visiteChauveSouris(boucle, yeux, sourire, visiteuse);
      regardLuneEtCitrouille(boucle, yeux, sourire, avecLune);
    });
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
