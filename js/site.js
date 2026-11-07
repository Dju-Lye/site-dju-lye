// Deux choses : la pause des animations, et le découpage des titres en mots (révélés par le CSS au défilement).
// Sans JavaScript, le site reste complet : le bouton n'existe pas, les titres s'affichent d'un bloc.
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
    : matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pause : bouton rond en bas de page, nom accessible dans un libellé masqué.
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

  // Titres : un <span class="m" style="--i:n"> par mot, seulement si le navigateur sait révéler au défilement.
  if (!CSS.supports("animation-timeline: view()")) return;
  var numero = 0;
  function decouper(noeud) {
    Array.from(noeud.childNodes).forEach(function (enfant) {
      if (enfant.nodeType === 1) return decouper(enfant);
      if (enfant.nodeType !== 3) return;
      var morceaux = enfant.textContent.split(/( +)/);
      var fragment = document.createDocumentFragment();
      morceaux.forEach(function (morceau) {
        if (!morceau.trim()) return fragment.append(morceau);
        var mot = document.createElement("span");
        mot.className = "m";
        mot.style.setProperty("--i", numero++);
        mot.textContent = morceau;
        fragment.append(mot);
      });
      enfant.replaceWith(fragment);
    });
  }
  document.querySelectorAll("main h2[id]:not(.etiquette)").forEach(function (titre) {
    numero = 0;
    decouper(titre);
  });
})();
