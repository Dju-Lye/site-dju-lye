// Animations GSAP du thème Geek (« Pixels de quartier »), uniquement quand ce thème est actif.
// Détection : la feuille saisons/geek.css est liée dans index.html (et non désactivée).
// Rien ne démarre si « sans-animation » est sur <html> (posée par animations.js : bouton ou
// « moins de mouvement ») : le sourire et la phrase restent alors tels quels, entiers.
// Tout passe par des tweens GSAP, donc par la pause globale ; si le visiteur arrête les animations en
// cours de route, la phrase et le sourire sont terminés d'un coup, jamais laissés à moitié.
(function () {
  var racine = document.documentElement;
  var avecDessin = typeof DrawSVGPlugin !== "undefined";
  var TRAITS = 6;       // le sourire se trace en 6 petits traits
  var finisseurs = [];  // fonctions qui terminent chaque animation d'un coup

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

    // Animations arrêtées en cours de route : tout est terminé d'un coup
    new MutationObserver(function () {
      if (!animationsArretees()) return;
      finisseurs.forEach(function (finir) { finir(); });
      finisseurs = [];
    }).observe(racine, { attributes: true, attributeFilter: ["class"] });
  }

  if (typeof gsap === "undefined" || !themeGeekActif() || animationsArretees()) return rendreLeSourire();
  demarrer();
})();
