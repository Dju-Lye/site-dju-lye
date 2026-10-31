// Bouton « Arrêter les animations » : pose ou retire la classe « sans-animation » sur <html>.
// Sans JavaScript, le bouton n'existe pas et le site fonctionne comme avant.
(function () {
  var CLE = "animations-arretees"; // valeurs mémorisées : "oui" ou "non"
  var racine = document.documentElement;

  // Le stockage peut être bloqué : on n'en dépend jamais.
  function lire() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(valeur) { try { localStorage.setItem(CLE, valeur); } catch (e) {} }

  // Un choix explicite passe avant tout ; sinon on suit la demande « moins de mouvement ».
  var choix = lire();
  var arretees = choix === "oui" || choix === "non"
    ? choix === "oui"
    : window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var bouton = document.createElement("button");
  bouton.type = "button";
  bouton.id = "pause-animations";

  // GSAP (si présent) suit la même pause que les animations CSS.
  function pauserGsap() {
    if (typeof gsap === "undefined") return;
    if (arretees) gsap.globalTimeline.pause(); else gsap.globalTimeline.resume();
  }

  function afficher() {
    racine.classList.toggle("sans-animation", arretees);
    pauserGsap();
    bouton.textContent = arretees ? "Reprendre les animations" : "Arrêter les animations";
  }

  bouton.addEventListener("click", function () {
    arretees = !arretees;
    ecrire(arretees ? "oui" : "non");
    afficher();
  });

  afficher();
  racine.classList.add("avec-pause"); // laisse de la place sous le pied de page
  document.body.appendChild(bouton);
})();
