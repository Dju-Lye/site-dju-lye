// Animations GSAP du thème Geek (« Pixels de quartier »), uniquement quand ce thème est actif.
// Détection : la feuille saisons/geek.css est liée dans index.html (et non désactivée).
// Rien ne démarre si « sans-animation » est sur <html> (posée par animations.js : bouton ou
// « moins de mouvement ») : le sourire et la phrase restent alors tels quels, entiers.
// Tout passe par des tweens GSAP, donc par la pause globale ; si le visiteur arrête les animations en
// cours de route, la phrase et le sourire sont terminés d'un coup, jamais laissés à moitié.
// Seconde vague (jauge de lecture, tarif en score, Bip qui visite, Bip du pied de page, œufs de Pâques) : chaque
// élément expose debut() et fin(). Pause ou « moins de mouvement » : fin() arrête minuteurs, écouteurs et tweens
// et remet tout en place ; reprise des animations : debut() relance. Aucun stockage, aucune requête.
(function () {
  var racine = document.documentElement;
  var avecDessin = typeof DrawSVGPlugin !== "undefined";
  var TRAITS = 6;       // le sourire se trace en 6 petits traits
  var finisseurs = [];  // fonctions qui terminent chaque animation d'un coup
  var vivants = [];     // éléments de la seconde vague : { debut(), fin() }

  function themeGeekActif() {
    var lien = document.querySelector('link[rel="stylesheet"][href$="saisons/geek.css"]');
    return !!lien && !lien.disabled;
  }

  // Le sourire est masqué par le CSS (classe posée dans le <head>) en attendant son tracé.
  function rendreLeSourire() { racine.classList.remove("sourire-attendu"); }

  function animationsArretees() { return racine.classList.contains("sans-animation"); }

  // Sourire « en 8 bits » : six traits (copies du sourire, chacune dessinée sur un sixième du tracé)
  // apparaissent un à un en fondu, puis le sourire d'origine reprend la place.
  function sourireEnTraits(sourire) {
    var traits = [];
    for (var i = 0; i < TRAITS; i++) {
      var trait = sourire.cloneNode(true);
      trait.setAttribute("class", "logo-sourire-trait");
      sourire.parentNode.insertBefore(trait, sourire.nextSibling);
      traits.push(trait);
      var debut = i * 100 / TRAITS;
      gsap.set(trait, { drawSVG: debut + "% " + (debut + 100 / TRAITS + 0.5) + "%", autoAlpha: 0 });
    }
    sourire.style.visibility = "hidden";
    rendreLeSourire();

    function terminer() {
      traits.forEach(function (trait) { trait.remove(); });
      sourire.style.visibility = "visible";
    }
    var tl = gsap.timeline({ delay: 0.5, onComplete: terminer });
    tl.to(traits, { autoAlpha: 1, duration: 0.5, ease: "power1.out", stagger: 0.35 });
    finisseurs.push(function () { tl.kill(); terminer(); });
  }

  // Phrase de saison : le texte complet reste dans la page pour les lecteurs d'écran (.sr-seul) ;
  // la copie visible (aria-hidden) s'affiche lettre par lettre, en fondu, quand la phrase entre à l'écran.
  function phraseQuiSEcrit(phrase) {
    var texte = phrase.textContent;
    if (!texte.trim()) return;
    var lisible = document.createElement("span");
    lisible.className = "sr-seul";
    lisible.textContent = texte;
    var frappe = document.createElement("span");
    frappe.setAttribute("aria-hidden", "true");
    var lettres = Array.from(texte).map(function (caractere) {
      var lettre = document.createElement("span");
      lettre.className = "l";
      lettre.textContent = caractere;
      frappe.appendChild(lettre);
      return lettre;
    });
    var curseur = document.createElement("span");
    curseur.className = "curseur";
    curseur.setAttribute("aria-hidden", "true");
    curseur.textContent = "▌";
    phrase.replaceChildren(lisible, frappe, curseur);
    phrase.classList.add("saison-frappe");

    var tween = null;
    function ecrire() {
      tween = gsap.to(lettres, { opacity: 1, duration: 0.3, ease: "none", stagger: 0.045 });
    }
    var observateur = null;
    if ("IntersectionObserver" in window) {
      observateur = new IntersectionObserver(function (entrees) {
        if (!entrees[0].isIntersecting) return;
        observateur.disconnect();
        ecrire();
      }, { threshold: 0.6 });
      observateur.observe(phrase);
    } else {
      ecrire();
    }
    finisseurs.push(function () {
      if (observateur) observateur.disconnect();
      if (tween) tween.kill();
      phrase.classList.add("saison-fini");
    });
  }

  function demarrer() {
    var sourire = document.querySelector(".accroche .logo .logo-sourire");
    if (sourire && avecDessin) {
      gsap.registerPlugin(DrawSVGPlugin);
      sourireEnTraits(sourire);
    } else {
      rendreLeSourire();
    }
    var phrase = document.querySelector(".saison");
    if (phrase) phraseQuiSEcrit(phrase);
  }

  function creer(balise, classe) {
    var element = document.createElement(balise);
    element.className = classe;
    return element;
  }

  // 13. Jauge de lecture : barre de pastilles de 6 px en haut de page, qui se remplit avec le défilement
  // (décorative, aria-hidden) ; à 100 %, l'étiquette « Bip a tout lu » apparaît 3 s. Un seul écouteur passif,
  // limité à une mise à jour par image. Moins de mouvement ou pause : la jauge n'existe pas.
  function jaugeDeLecture() {
    var jauge = null, plein, etiquette, minuteur = null, attente = false, vue = false;
    function maj() {
      attente = false;
      if (jauge.hidden) return;
      var course = racine.scrollHeight - window.innerHeight;
      var part = course > 0 ? Math.min(1, Math.max(0, window.scrollY / course)) : 0;
      plein.style.setProperty("--lu", part.toFixed(3));
      if (part >= 0.995 && !vue) {
        vue = true;
        etiquette.classList.add("visible");
        minuteur = setTimeout(cacher, 3000);
      } else if (part < 0.9) {
        vue = false;
      }
    }
    function cacher() { etiquette.classList.remove("visible"); }
    function auDefilement() {
      if (attente) return;
      attente = true;
      requestAnimationFrame(maj);
    }
    return {
      debut: function () {
        if (!jauge) {
          jauge = creer("div", "jauge");
          jauge.setAttribute("aria-hidden", "true");
          plein = creer("div", "jauge-plein");
          etiquette = creer("div", "jauge-etiquette");
          etiquette.textContent = "Bip a tout lu";
          jauge.append(plein, etiquette);
          document.body.appendChild(jauge);
        }
        jauge.hidden = false;
        window.addEventListener("scroll", auDefilement, { passive: true });
        maj();
      },
      fin: function () {
        window.removeEventListener("scroll", auDefilement);
        clearTimeout(minuteur);
        if (jauge) { cacher(); jauge.hidden = true; }
      }
    };
  }

  // 15. Tarif « en score » : le « 50 » de « 50 € de l'heure » compte de 0 à 50 en 1,5 s quand il entre à l'écran,
  // en 4 paliers (au plus 3 changements par seconde). Le texte final est déjà dans le HTML : les lecteurs d'écran
  // (copie .sr-seul) et la page sans JavaScript voient « 50 € ». Largeur du compteur fixée sur celle de « 50 »
  // (en em) : rien ne bouge autour. Ensuite, « → 25 € » apparaît en décor (aria-hidden).
  function tarifEnScore() {
    var prix = document.querySelector(".tarif .prix");
    var noeud = prix && prix.firstChild;
    if (!noeud || noeud.nodeType !== 3 || noeud.nodeValue.indexOf("50") !== 0) return null;
    var score = null, bonus, observateur = null, tween = null, termine = false, actif = false;

    function afficher(valeur) {
      var texte = String(Math.round(valeur));
      if (score.textContent !== texte) score.textContent = texte;
    }
    function preparer() {
      var lisible = creer("span", "sr-seul");
      lisible.textContent = "50";
      score = creer("span", "score");
      score.setAttribute("aria-hidden", "true");
      score.textContent = "50";
      noeud.nodeValue = noeud.nodeValue.slice(2);
      prix.insertBefore(lisible, noeud);
      prix.insertBefore(score, noeud);
      score.style.width = score.getBoundingClientRect().width / parseFloat(getComputedStyle(score).fontSize) + "em";
      bonus = creer("span", "bonus-25");
      bonus.setAttribute("aria-hidden", "true");
      bonus.textContent = "→\u00a025\u00a0€";
      prix.appendChild(bonus);
    }
    function finir() {
      termine = true;
      if (observateur) observateur.disconnect();
      if (tween) tween.kill();
      afficher(50);
      bonus.style.opacity = 1; // en direct : la ligne de temps de GSAP peut être en pause
      bonus.style.transform = "none";
    }
    function compter() {
      var etat = { v: 0 };
      tween = gsap.to(etat, {
        v: 50, duration: 1.5, ease: "steps(4)",
        onUpdate: function () { afficher(etat.v); },
        onComplete: function () {
          afficher(50);
          termine = true;
          gsap.to(bonus, { opacity: 1, y: 0, duration: 0.6, ease: "power1.out" });
        }
      });
    }
    function armer() {
      if (!actif || termine) return;
      if (!score) preparer();
      afficher(0);
      observateur = new IntersectionObserver(function (entrees) {
        if (!entrees[0].isIntersecting) return;
        observateur.disconnect();
        compter();
      }, { threshold: 0.6 });
      observateur.observe(prix);
    }
    return {
      debut: function () {
        if (termine) return;
        actif = true;
        var boite = prix.getBoundingClientRect();
        if (boite.top < window.innerHeight && boite.bottom > 0) return; // déjà à l'écran : on ne le fait pas revenir à 0
        (document.fonts ? document.fonts.ready : Promise.resolve()).then(armer); // largeur mesurée avec la vraie police
      },
      fin: function () {
        actif = false;
        if (score) finir(); // arrêté en route : valeur finale, d'un coup
      }
    };
  }

  // Écouteur de redimensionnement qui ne réagit qu'à un changement de largeur (pas à la barre d'adresse du mobile)
  function auChangementDeLargeur(rappel) {
    var largeur = window.innerWidth, minuteur = null;
    return function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(function () {
        if (window.innerWidth === largeur) return;
        largeur = window.innerWidth;
        rappel();
      }, 200);
    };
  }

  // 3. Bip visite le logo (PC dès 900 px) : vers 9 s après l'ouverture, puis toutes les 45 s, Bip quitte sa place
  // au-dessus du logo, traverse l'espace libre en 12 petits pas (GSAP + MotionPath, ease steps()), se pose à côté du
  // logo (à la moitié de la hauteur du symbole), le logo tourne les yeux vers lui et cligne, puis Bip rentre.
  // Tout est calculé depuis le logo mesuré et recalculé quand la largeur change. C'est le même élément que le Bip du haut.
  function bipVisiteLeLogo(bip, logo) {
    var symbole = logo.querySelector(".logo-symbole");
    var yeux = gsap.utils.toArray(logo.querySelectorAll(".logo-oeil"));
    var TRAJET = 4.5;  // secondes par trajet, 12 pas : 2,7 changements par seconde
    var CYCLE = 45;    // une visite toutes les 45 s
    var largeurs = null, delai = 9, ecoute = null;

    function mesurer() {
      var base = logo.parentNode.getBoundingClientRect();
      var boite = logo.getBoundingClientRect();
      var style = getComputedStyle(bip);
      var h = symbole.getBoundingClientRect().height;
      var dx = boite.right - base.left + h / 2 - parseFloat(style.left);
      var dy = boite.top + boite.height / 2 - base.top - parseFloat(style.top) - bip.getBoundingClientRect().height / 2;
      var libre = dx - h / 2 + 6; // à partir de là, Bip est entièrement à droite du logo : il peut descendre
      return [{ x: 0, y: 0 }, { x: libre / 2, y: -3 }, { x: libre, y: -3 }, { x: dx, y: dy / 2 }, { x: dx, y: dy }];
    }
    function marcher(tl, chemin, debut) {
      tl.to(bip, { motionPath: { path: chemin, curviness: 1 }, duration: TRAJET, ease: "steps(12)" }, debut);
    }
    function monter() {
      if (largeurs) largeurs.revert();
      largeurs = gsap.matchMedia();
      largeurs.add("(min-width: 900px)", function () {
        var aller = mesurer();
        var tl = gsap.timeline({ delay: delai, repeat: -1 });
        tl.call(function () { bip.classList.add("en-visite"); }, null, 0);
        marcher(tl, aller, 0);
        tl.to(yeux, { x: 1.8, duration: 0.5, ease: "power2.inOut" }, TRAJET + 0.3)
          .to(yeux, { scaleY: 0.1, duration: 0.35, ease: "sine.in", transformOrigin: "50% 50%" }, TRAJET + 1)
          .to(yeux, { scaleY: 1, duration: 0.45, ease: "sine.out" }, TRAJET + 1.35)
          .to(yeux, { x: 0, duration: 0.5, ease: "power2.inOut" }, TRAJET + 3);
        marcher(tl, aller.slice().reverse(), TRAJET + 3.5);
        tl.call(function () { bip.classList.remove("en-visite"); })
          .to({}, { duration: CYCLE - 2 * TRAJET - 3.5 });
        return function () { bip.classList.remove("en-visite"); };
      });
    }
    return {
      enCours: function () { return bip.classList.contains("en-visite"); },
      debut: function (premier) {
        delai = premier == null ? 9 : premier;
        window.removeEventListener("resize", ecoute);
        ecoute = auChangementDeLargeur(monter);
        window.addEventListener("resize", ecoute);
        monter();
      },
      fin: function () {
        window.removeEventListener("resize", ecoute);
        if (largeurs) largeurs.revert();
        largeurs = null;
      }
    };
  }

  // 11. Bip du pied de page : la même silhouette que Bip du haut (copie), qui se balade de gauche à droite sous
  // « Mentions légales », revient s'arrêter devant et se retourne (petit saut). Jamais animé en même temps que
  // Bip du haut : il ne marche que s'il est à l'écran ET que Bip du haut est hors écran (IntersectionObserver) ;
  // sinon il reste immobile (classe .immobile : plus aucune animation CSS non plus).
  function bipDuPied(bipHaut) {
    var zone = document.querySelector("footer .contenu");
    var lien = zone && zone.querySelector("a");
    if (!lien) return null;
    var jeu = creer("div", "pied-jeu");
    var piste = creer("div", "bip-pied immobile");
    piste.setAttribute("aria-hidden", "true");
    var marcheur = bipHaut.cloneNode(true);
    marcheur.setAttribute("class", "bip-marcheur");
    piste.appendChild(marcheur);
    jeu.appendChild(piste);
    zone.appendChild(jeu);
    var PAS = 24, CADENCE = 2.5; // un pas de 24 px, 2,5 pas par seconde
    var tl = null, observateur = null, ecoute = null, actif = false, haut = false, bas = false;

    function construire() {
      if (tl) tl.kill();
      var devant = lien.getBoundingClientRect().left + lien.getBoundingClientRect().width / 2 - piste.getBoundingClientRect().left - 20;
      var course = piste.clientWidth - 40 - devant;
      marcheur.style.left = Math.max(0, devant) + "px";
      if (course < 2 * PAS) return;
      var pas = Math.round(course / PAS), duree = pas / CADENCE;
      tl = gsap.timeline({ repeat: -1, repeatDelay: 4, paused: true });
      tl.to(marcheur, { x: course, duration: duree, ease: "steps(" + pas + ")" })
        .to(marcheur, { y: -6, duration: 0.25, ease: "power1.out", yoyo: true, repeat: 1 })
        .set(marcheur, { scaleX: -1 })
        .to(marcheur, { x: 0, duration: duree, ease: "steps(" + pas + ")" })
        .to(marcheur, { y: -6, duration: 0.25, ease: "power1.out", yoyo: true, repeat: 1 })
        .set(marcheur, { scaleX: 1 })
        .to({}, { duration: 3 });
    }
    function majMarche() {
      var corps = document.body.classList;
      var marche = actif && bas && !haut && !corps.contains("bip-ailleurs") && !corps.contains("bip-dort");
      piste.classList.toggle("immobile", !marche);
      if (tl) tl.paused(!marche);
    }
    function auVu(entrees) {
      entrees.forEach(function (entree) {
        if (entree.target === bipHaut) haut = entree.isIntersecting; else bas = entree.isIntersecting;
      });
      majMarche();
    }
    return {
      maj: majMarche,
      debut: function () {
        actif = true;
        construire();
        ecoute = auChangementDeLargeur(function () { construire(); majMarche(); });
        if (document.fonts) document.fonts.ready.then(function () { if (actif) { construire(); majMarche(); } }); // la police change la largeur du lien
        window.addEventListener("resize", ecoute);
        observateur = new IntersectionObserver(auVu);
        observateur.observe(bipHaut);
        observateur.observe(piste);
      },
      fin: function () {
        actif = false;
        window.removeEventListener("resize", ecoute);
        if (observateur) observateur.disconnect();
        if (tl) tl.kill();
        tl = null;
        marcheur.style.cssText = ""; // en direct : la ligne de temps de GSAP peut être en pause
        piste.classList.add("immobile");
      }
    };
  }

  // ---------- Œufs de Pâques (décoratifs, sans marque). Les trois premiers et le dernier bougent : ils sont inertes
  // en moins de mouvement et animations arrêtées (écouteurs et minuteurs retirés). Le pixel caché n'a aucun mouvement. ----------

  // a) Code ↑ ↑ ↓ ↓ ← → ← → B A : Bip quitte sa place et traverse l'écran en dansant (copie fixe, 7 s, pas de 2,6 par seconde)
  // pendant qu'un message poli s'affiche ; une seule fois par visite (en mémoire, pas de stockage).
  function porteSecrete(bip, visite, pied) {
    var CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var rang = 0, fait = false, tl = null;
    var message = creer("div", "message-secret"); // zone « status » toujours présente, vide tant qu'il n'y a rien à dire
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    var danseur = bip.cloneNode(true); // copie du Bip, créée avant toute classe d'état
    danseur.setAttribute("class", "bip-danse");
    danseur.setAttribute("hidden", ""); // attribut (un SVG n'a pas de propriété hidden)
    document.body.append(message, danseur);

    function ranger() {
      if (tl) tl.kill();
      tl = null;
      danseur.setAttribute("hidden", "");
      message.textContent = "";
      document.body.classList.remove("bip-ailleurs");
      if (pied) pied.maj();
    }
    function danser() {
      fait = true;
      visite.fin();
      document.body.classList.add("bip-ailleurs"); // Bip du haut et Bip du pied s'effacent : un seul Bip à la fois
      if (pied) pied.maj();
      message.textContent = "Bravo, vous avez trouvé la porte secrète\u202f!";
      danseur.removeAttribute("hidden");
      gsap.set(danseur, { x: -60, y: 0, rotation: 0, transformOrigin: "50% 100%" });
      tl = gsap.timeline({
        onComplete: function () { ranger(); visite.debut(20); }
      });
      tl.to(danseur, { x: window.innerWidth + 60, duration: 7, ease: "steps(18)" }, 0)
        .to(danseur, { rotation: 10, duration: 0.5, repeat: 13, yoyo: true, ease: "sine.inOut" }, 0)
        .to(danseur, { y: -14, duration: 0.5, repeat: 13, yoyo: true, ease: "power1.inOut" }, 0)
        .to({}, { duration: 0.5 }, 7); // le message reste encore un instant
    }
    function auClavier(evenement) {
      if (!evenement.key || evenement.ctrlKey || evenement.altKey || evenement.metaKey) return;
      var touche = evenement.key.length === 1 ? evenement.key.toLowerCase() : evenement.key;
      rang = touche === CODE[rang] ? rang + 1 : (touche === CODE[0] ? 1 : 0);
      if (rang < CODE.length) return;
      rang = 0;
      if (!fait) danser();
    }
    return {
      debut: function () { document.addEventListener("keydown", auClavier); },
      fin: function () { document.removeEventListener("keydown", auClavier); rang = 0; ranger(); }
    };
  }

  // b) 5 clics rapprochés sur le logo : grand sourire pendant 2 s et 5 étoiles-pixels qui pétillent autour du symbole.
  function grandSourire(logo, visite) {
    var sourire = logo.querySelector(".logo-sourire");
    var symbole = logo.querySelector(".logo-symbole");
    var normal = sourire && sourire.getAttribute("d");
    var FONDS = ["--e-miel", "--e-menthe", "--e-rose", "--e-miel", "--e-menthe"];
    var compte = 0, dernier = 0, tl = null, etoiles = [];

    function ranger() {
      if (tl) tl.kill();
      tl = null;
      sourire.setAttribute("d", normal);
      etoiles.forEach(function (etoile) { etoile.remove(); });
      etoiles = [];
    }
    function sourireEtEtoiles() {
      var base = logo.parentNode.getBoundingClientRect();
      var boite = symbole.getBoundingClientRect();
      var rayon = boite.height * 0.78, centre = { x: boite.left + boite.width / 2 - base.left, y: boite.top + boite.height / 2 - base.top };
      tl = gsap.timeline({ onComplete: ranger });
      tl.to(sourire, { attr: { d: "M12 36 Q32 66 52 36" }, duration: 0.4, ease: "back.out(2)" }, 0)
        .to(sourire, { attr: { d: normal }, duration: 0.4, ease: "power2.inOut" }, 1.6);
      FONDS.forEach(function (fond, i) {
        var etoile = creer("span", "etoile-pixel");
        var angle = (-150 + i * 75) * Math.PI / 180;
        etoile.setAttribute("aria-hidden", "true");
        etoile.style.backgroundImage = "var(" + fond + ")";
        etoile.style.left = centre.x + Math.cos(angle) * rayon - 9 + "px";
        etoile.style.top = centre.y + Math.sin(angle) * rayon - 9 + "px";
        logo.parentNode.appendChild(etoile);
        etoiles.push(etoile);
        tl.fromTo(etoile, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, i * 0.12)
          .to(etoile, { scale: 0.7, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, i * 0.12 + 0.4)
          .to(etoile, { opacity: 0, duration: 0.4 }, i * 0.12 + 1.4);
      });
    }
    function auClic() {
      var maintenant = Date.now();
      compte = maintenant - dernier < 1500 ? compte + 1 : 1;
      dernier = maintenant;
      if (compte < 5) return;
      compte = 0;
      // pas pendant l'ouverture (tracé du sourire), ni pendant une visite, ni déjà en cours
      if (tl || visite.enCours() || gsap.globalTimeline.time() < 6) return;
      sourireEtEtoiles();
    }
    return {
      debut: function () { logo.addEventListener("click", auClic); },
      fin: function () { logo.removeEventListener("click", auClic); compte = 0; if (tl) ranger(); }
    };
  }

  // c) Bip s'endort après 60 s sans mouvement de souris, clavier, toucher ni défilement : yeux fermés, trois
  // « z » très lents (classe bip-dort sur <body>) ; il se réveille au premier geste. Contrôle toutes les 2 s.
  function sommeil(visite, pied) {
    var GESTES = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    var dernier = Date.now(), minuteur = null, dort = false;

    function reveil() {
      dernier = Date.now();
      if (!dort) return;
      coucher(false);
      visite.debut(15); // la visite reprend un peu plus tard
    }
    function coucher(oui) {
      dort = oui;
      document.body.classList.toggle("bip-dort", oui);
      if (pied) pied.maj();
    }
    function veiller() {
      if (dort || visite.enCours() || Date.now() - dernier < 60000) return;
      visite.fin();
      coucher(true);
    }
    return {
      debut: function () {
        dernier = Date.now();
        GESTES.forEach(function (nom) { window.addEventListener(nom, reveil, { passive: true }); });
        minuteur = setInterval(veiller, 2000);
      },
      fin: function () {
        GESTES.forEach(function (nom) { window.removeEventListener(nom, reveil); });
        clearInterval(minuteur);
        if (dort) coucher(false);
      }
    };
  }

  // d) Pixel miel presque invisible au bout de la ligne de Bip du pied de page : atteignable au clavier, il ouvre
  // une petite bulle (zone « status ») ; Entrée, Espace ou un clic l'ouvre et la ferme, Échap ou la sortie du focus aussi.
  function pixelCache() {
    var jeu = document.querySelector(".pied-jeu");
    if (!jeu) return;
    var bouton = creer("button", "pixel-cache");
    bouton.type = "button";
    bouton.setAttribute("aria-label", "Un petit pixel caché");
    var bulle = creer("span", "bulle-pixel");
    bulle.setAttribute("role", "status");
    bulle.setAttribute("aria-live", "polite");
    function fermer() { bulle.textContent = ""; }
    bouton.addEventListener("click", function () {
      bulle.textContent = bulle.textContent ? "" : "Il est interdit de fouiller ici. Merci d'avoir fouillé.";
    });
    bouton.addEventListener("blur", fermer);
    bouton.addEventListener("keydown", function (evenement) { if (evenement.key === "Escape") fermer(); });
    jeu.append(bouton, bulle);
  }

  // e) Un clic sur le « 25 € » (celui de la phrase du tarif, ou le « → 25 € » en décor) : il rebondit comme une
  // balle et un petit « Bonus ! » (aria-hidden) s'envole. Le « 25 € » de la phrase est seulement enveloppé d'un <span>.
  function vingtCinq() {
    var zone = document.querySelector(".tarif .contenu");
    var phrase = zone && zone.querySelector("p:not(.prix)");
    var noeud = phrase && phrase.firstChild;
    var cible = "25\u00a0€";
    var rebond = null, rebondi = null;
    while (noeud && !(noeud.nodeType === 3 && noeud.nodeValue.indexOf(cible) >= 0)) noeud = noeud.nextSibling;
    if (!noeud) return null;
    var plage = document.createRange();
    plage.setStart(noeud, noeud.nodeValue.indexOf(cible));
    plage.setEnd(noeud, noeud.nodeValue.indexOf(cible) + cible.length);
    plage.surroundContents(creer("span", "vingt-cinq"));

    function bonus(boite) {
      var base = zone.getBoundingClientRect();
      var mot = creer("span", "bonus-mot");
      mot.setAttribute("aria-hidden", "true");
      mot.textContent = "Bonus\u202f!";
      mot.style.left = boite.left - base.left + boite.width / 2 + "px";
      mot.style.top = boite.top - base.top - 34 + "px";
      zone.appendChild(mot);
      gsap.timeline({ onComplete: function () { mot.remove(); } })
        .fromTo(mot, { opacity: 0, y: 6, xPercent: -50 }, { opacity: 1, y: -6, xPercent: -50, duration: 0.5, ease: "power1.out" })
        .to(mot, { opacity: 0, duration: 0.5 }, 1.4);
    }
    function auClic(evenement) {
      var element = evenement.target.closest(".vingt-cinq, .bonus-25");
      if (!element || rebond || getComputedStyle(element).opacity < 0.5) return;
      bonus(element.getBoundingClientRect());
      rebondi = element;
      rebond = gsap.fromTo(element, { y: -36 }, {
        y: 0, duration: 1.6, ease: "bounce.out", // 4 rebonds en 1,6 s : au plus 3 changements par seconde
        onComplete: function () { rebond = null; }
      });
    }
    return {
      debut: function () { zone.addEventListener("click", auClic); },
      fin: function () {
        zone.removeEventListener("click", auClic);
        if (rebond) { rebond.kill(); rebond = null; rebondi.style.transform = ""; }
      }
    };
  }

  // Les animations arrêtées en cours de route terminent tout d'un coup ; reprises, elles relancent la seconde vague.
  function suivreLaPause() {
    var enCours = !animationsArretees();
    new MutationObserver(function () {
      var arretees = animationsArretees();
      if (arretees && enCours) {
        finisseurs.forEach(function (finir) { finir(); });
        finisseurs = [];
        vivants.forEach(function (v) { v.fin(); });
      } else if (!arretees && !enCours) {
        vivants.forEach(function (v) { v.debut(); });
      }
      enCours = !arretees;
    }).observe(racine, { attributes: true, attributeFilter: ["class"] });
    if (enCours) vivants.forEach(function (v) { v.debut(); });
  }

  if (typeof gsap === "undefined" || !themeGeekActif()) return rendreLeSourire();
  if (animationsArretees()) rendreLeSourire(); else demarrer();
  vivants.push(jaugeDeLecture());
  var tarif = tarifEnScore();
  if (tarif) vivants.push(tarif);
  var bip = document.querySelector(".accroche .bip");
  var logo = document.querySelector(".accroche .logo");
  if (bip && logo && typeof MotionPathPlugin !== "undefined") {
    gsap.registerPlugin(MotionPathPlugin);
    var pied = bipDuPied(bip); // copie du Bip, créée avant que le Bip du haut ne reçoive des classes d'état
    if (pied) vivants.push(pied);
    var visite = bipVisiteLeLogo(bip, logo);
    vivants.push(visite, porteSecrete(bip, visite, pied), grandSourire(logo, visite), sommeil(visite, pied));
    pixelCache();
  }
  var bonus = vingtCinq();
  if (bonus) vivants.push(bonus);
  suivreLaPause();
})();
