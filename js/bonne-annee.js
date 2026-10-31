// Animations GSAP du logo, uniquement quand le thème Bonne année est actif.
// Détection : la feuille saisons/bonne-annee.css est liée dans index.html (et non désactivée).
// Rien ne démarre si « sans-animation » est sur <html> (posée par animations.js : bouton ou
// « moins de mouvement ») ; tout passe par des tweens GSAP, donc par la pause globale.
// La partie logo (introduction, clignement, mesures) est copiée de js/lumieres-decembre.js (lui-même copié de halloween.js).
(function () {
  var racine = document.documentElement;
  var demarre = false;
  var avecDessin = typeof DrawSVGPlugin !== "undefined";
  var PASSAGES = 2; // le bouchon passe deux fois au plus par visite de la page, jamais en boucle
  var ECART = 32;   // secondes entre le début des deux passages
  var lancees = 0;  // passages commencés, conservé quand la fenêtre est redimensionnée

  // Décalage des yeux, en unités du logo (environ 2 px à l'écran)
  var VERS_ETOILE = { x: -0.8, y: -2 };
  var AU_CENTRE = { x: 0, y: 0 };

  var NS = "http://www.w3.org/2000/svg";
  var LISERE = { stroke: "#ffffff", "stroke-width": 1.5, "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" };
  var COULEURS = ["#f1d9a0", "#e8a0b0", "#f5c33b", "#8e6bb5"]; // champagne, rose poudré, miel, lilas
  var RAYONS = [4.6, 3.4, 5.4, 4, 4.8, 3.2];
  // Zone sûre des confettis posés : fractions (x, y) du rectangle libre à droite du bouchon
  var POSES = [[0.1, 0.3], [0.3, 0.8], [0.5, 0.2], [0.65, 0.75], [0.85, 0.35], [0.95, 0.85]];

  function themeActif() {
    var lien = document.querySelector('link[rel="stylesheet"][href$="saisons/bonne-annee.css"]');
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

  function creer(nom, attributs, parent) {
    var element = document.createElementNS(NS, nom);
    for (var cle in attributs) element.setAttribute(cle, attributs[cle]);
    if (parent) parent.appendChild(element);
    return element;
  }

  // SVG en ligne, caché par défaut : bouchon de champagne (tête champagne, collerette rose, sans visage) et six confettis.
  // Le SVG déborde de sa boîte (CSS) : le bond et les confettis sortent du carré de 56 px.
  function creerBouchon(parent) {
    var svg = creer("svg", {
      "class": "bouchon-pop", "aria-hidden": "true", focusable: "false",
      viewBox: "-28 -28 56 56", width: 56, height: 56, style: "display:none"
    }, parent);
    var confettis = RAYONS.map(function (r, i) {
      return creer("circle", Object.assign({ cx: 0, cy: 0, r: r, fill: COULEURS[i % COULEURS.length] }, LISERE), svg);
    });
    var corps = creer("g", { "class": "bouchon-corps" }, svg);
    creer("rect", Object.assign({ x: -7, y: -3, width: 14, height: 14, rx: 4, fill: "#e8a0b0" }, LISERE), corps);
    creer("rect", Object.assign({ x: -11, y: -13, width: 22, height: 12, rx: 6, fill: "#f1d9a0" }, LISERE), corps);
    return { svg: svg, corps: corps, confettis: confettis };
  }

  // Zone sûre des confettis, en px depuis le coin du .contenu : à droite du bouchon, entre le milieu du logo et le
  // premier texte ou bouton (jamais dans le ciel du haut, ni sur un texte). Retourne null si elle est trop petite.
  function zoneSure(logo, mesure, pose) {
    var base = logo.parentNode.getBoundingClientRect();
    var hautTexte = Infinity;
    gsap.utils.toArray(logo.parentNode.querySelectorAll("h1, p, .bouton")).forEach(function (e) {
      hautTexte = Math.min(hautTexte, e.getBoundingClientRect().top - base.top);
    });
    var x0 = pose.x + 38;
    var zone = {
      x0: x0,
      x1: Math.min(x0 + 3 * mesure.hauteur, base.width - 24),
      y0: mesure.milieu + 0.1 * mesure.hauteur,
      y1: Math.min(mesure.milieu + 0.6 * mesure.hauteur, hautTexte - 8)
    };
    return zone.x1 - zone.x0 > 60 && zone.y1 - zone.y0 > 10 ? zone : null;
  }

  // Retourne le bouchon prêt, sa position et les cibles des confettis (relatives au bouchon), ou null
  function preparerBouchon(bouchon, logo, symbole) {
    if (!bouchon) return null;
    gsap.set(bouchon.svg, { display: "block", autoAlpha: 0, xPercent: -50, yPercent: -50 });
    var mesure = mesurerLogo(logo, symbole);
    var pose = { x: mesure.droite + mesure.hauteur / 2 + bouchon.svg.getBoundingClientRect().width / 2, y: mesure.milieu };
    var zone = zoneSure(logo, mesure, pose);
    var cibles = zone ? POSES.map(function (p) {
      return { x: zone.x0 + p[0] * (zone.x1 - zone.x0) - pose.x, y: zone.y0 + p[1] * (zone.y1 - zone.y0) - pose.y };
    }) : null;
    return { bouchon: bouchon, pose: pose, cibles: cibles };
  }

  // Un passage : le bouchon apparaît, fait un petit bond lent (« pop » sans bruit), les confettis montent un peu
  // puis se posent doucement dans la zone sûre, s'effacent ; le bouchon s'efface à son tour. Dure 16 s environ.
  function passage(v) {
    var b = v.bouchon;
    var tl = gsap.timeline();
    tl.call(function () { lancees++; }, null, 0)
      .set(b.svg, { x: v.pose.x, y: v.pose.y, autoAlpha: 0 }, 0)
      .set(b.confettis, { x: 0, y: -16, autoAlpha: 0 }, 0)
      .set(b.corps, { y: 0 }, 0)
      .to(b.svg, { autoAlpha: 1, duration: 1.5 }, 0)
      .to(b.corps, { y: -12, duration: 1.8, ease: "sine.out" }, 2)
      .addLabel("pop", 3.8)
      .to(b.corps, { y: 0, duration: 2.2, ease: "sine.inOut" }, "pop");
    if (v.cibles) {
      b.confettis.forEach(function (c, i) {
        var cible = v.cibles[i];
        var debut = i * 0.15;
        tl.to(c, { autoAlpha: 0.6, x: cible.x * 0.3, y: -34 - 2 * i, duration: 1.4, ease: "power2.out" }, "pop+=" + debut)
          .to(c, { x: cible.x, y: cible.y, duration: 3.5, ease: "sine.inOut" }, "pop+=" + (debut + 1.4))
          .to(c, { autoAlpha: 0, duration: 2, ease: "sine.inOut" }, "pop+=" + (8 + i * 0.1));
      });
    }
    tl.to(b.svg, { autoAlpha: 0, duration: 1.5 }, "pop+=11");
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
    var bouchon = creerBouchon(logo.parentNode);

    var debut = gsap.globalTimeline.time();
    var apres = introduction(symbole, sourire);
    clignement(yeux, apres + 2);
    departBoucle = debut + apres + 0.5;
    monterBoucle(logo, symbole, yeux, sourire, bouchon);
    // Le logo change de taille avec la fenêtre ou le zoom : on remesure et on recrée la boucle.
    var minuteur = null;
    window.addEventListener("resize", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(function () { monterBoucle(logo, symbole, yeux, sourire, bouchon); }, 150);
    });
  }

  // Les regards sont recréés selon la largeur ; le bouchon (PC seulement, dès 900 px) n'a que les passages restants.
  // Le nettoyage (revert) rend yeux, sourire et bouchon à leur état d'origine.
  var largeurs = null;
  var departBoucle = 0;
  function monterBoucle(logo, symbole, yeux, sourire, bouchon) {
    if (largeurs) largeurs.kill(true);
    var delai = Math.max(0.3, departBoucle - gsap.globalTimeline.time());
    largeurs = gsap.matchMedia();
    largeurs.add({ pc: "(min-width: 900px)" }, function (contexte) {
      var regards = gsap.timeline({ repeat: -1, delay: delai });
      regardEtoile(regards, yeux, sourire);
      var restants = PASSAGES - lancees;
      var visiteuse = contexte.conditions.pc && restants > 0 ? preparerBouchon(bouchon, logo, symbole) : null;
      if (!visiteuse) return;
      var passages = gsap.timeline({ delay: lancees ? 8 : delai + 2 });
      for (var i = 0; i < restants; i++) passages.add(passage(visiteuse), i * ECART);
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
