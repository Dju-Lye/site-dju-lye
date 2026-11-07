// Trois choses : la pause des animations, un petit « merci ! » au clic sur le mail, et les yeux de la mascotte qui suivent le curseur.
// Sans JavaScript, ou avec « moins de mouvement », le site reste complet et immobile : le bouton n'existe pas.
(function () {
  var CLE = "animations-arretees"; // valeurs mémorisées : "oui" ou "non"
  var racine = document.documentElement;

  // Le stockage peut être bloqué : on n'en dépend jamais.
  function lire() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(valeur) { try { localStorage.setItem(CLE, valeur); } catch (e) {} }

  // « Merci ! » : s'affiche deux secondes après un clic sur le lien du mail (le message part quand même).
  var merci = document.querySelector(".merci");
  if (merci) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (lien) {
      lien.addEventListener("click", function () {
        merci.textContent = "merci !";
        merci.classList.add("visible");
        setTimeout(function () { merci.classList.remove("visible"); merci.textContent = ""; }, 2500);
      });
    });
  }

  // « Moins de mouvement » : rien ne bouge (le CSS s'en charge), donc pas de bouton.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Le choix mémorisé est déjà appliqué avant le premier rendu par le script du <head> ; ici on garde l'état en phase.
  var arretees = lire() === "oui";

  // Pause : bouton rond, nom accessible dans un libellé masqué.
  var bouton = document.createElement("button");
  bouton.type = "button";
  bouton.id = "pause-animations";
  var libelle = document.createElement("span");
  libelle.className = "sr-seul";
  var icone = document.createElement("span");
  icone.className = "pause-icone";
  icone.setAttribute("aria-hidden", "true");
  bouton.append(libelle, icone);

  function afficher() {
    racine.classList.toggle("sans-animation", arretees);
    libelle.textContent = bouton.title = arretees ? "Reprendre les animations" : "Arrêter les animations";
  }
  bouton.addEventListener("click", function () {
    arretees = !arretees;
    ecrire(arretees ? "oui" : "non");
    afficher();
  });
  afficher();
  racine.classList.add("avec-pause");
  document.body.appendChild(bouton);

  // Yeux de la mascotte : les pupilles suivent le curseur ou le doigt, doucement (immobiles avec la pause).
  var pupilles = Array.from(document.querySelectorAll(".pupille"));
  var cible = null;
  var attente = false;
  function regarder() {
    attente = false;
    pupilles.forEach(function (pupille) {
      var r = pupille.getBoundingClientRect();
      var dx = cible && !arretees ? cible.x - (r.left + r.width / 2) : 0;
      var dy = cible && !arretees ? cible.y - (r.top + r.height / 2) : 0;
      var force = Math.min(1, Math.hypot(dx, dy) / 250) * 3; // 3 unités du dessin au maximum
      var angle = Math.atan2(dy, dx);
      pupille.style.transform = "translate(" + Math.cos(angle) * force + "px," + Math.sin(angle) * force + "px)";
    });
  }
  function suivre(x, y) {
    cible = { x: x, y: y };
    if (!attente) { attente = true; requestAnimationFrame(regarder); }
  }
  addEventListener("pointermove", function (e) { suivre(e.clientX, e.clientY); });
  addEventListener("touchmove", function (e) { suivre(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  document.addEventListener("pointerleave", function () { cible = null; regarder(); });
  bouton.addEventListener("click", regarder);
})();
