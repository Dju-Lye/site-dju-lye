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
      gsap.set(bonus, { opacity: 1, y: 0 });
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
  suivreLaPause();
})();
