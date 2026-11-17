// Quatre rôles légers, sans bibliothèque externe :
// 1. Bascule entre le mode clair (par défaut) et le mode sombre (mémorisé dans localStorage).
// 2. Copie de l'adresse contact@dju-lye.fr en un clic + message d'état honnête au clic sur mailto:.
// 3. Bouton pause des animations (absent si « moins de mouvement » est activé).
// 4. Pupilles de la mascotte qui suivent doucement le curseur.
(function () {
  var CLE_ANIM = "animations-arretees";
  var CLE_THEME = "theme-dju-lye";
  var racine = document.documentElement;

  function lire(cle) { try { return localStorage.getItem(cle); } catch (e) { return null; } }
  function ecrire(cle, valeur) { try { localStorage.setItem(cle, valeur); } catch (e) {} }

  // 1. Bascule Mode clair / Mode sombre
  var btnTheme = document.getElementById("bascule-theme");
  function appliquerTheme(theme) {
    racine.setAttribute("data-theme", theme);
    if (btnTheme) {
      var estSombre = theme === "sombre";
      btnTheme.setAttribute("aria-pressed", estSombre ? "true" : "false");
      btnTheme.textContent = estSombre ? "☀️ Mode clair" : "🌙 Mode sombre";
    }
  }
  var themeInitial = racine.getAttribute("data-theme") || lire(CLE_THEME) || "clair";
  appliquerTheme(themeInitial);

  if (btnTheme) {
    btnTheme.addEventListener("click", function () {
      var suivant = racine.getAttribute("data-theme") === "sombre" ? "clair" : "sombre";
      ecrire(CLE_THEME, suivant);
      appliquerTheme(suivant);
    });
  }

  // 2. Contact : message honnête sur mailto: + bouton « Copier l'adresse e-mail »
  var statut = document.querySelector(".statut-contact");
  var minuterieStatut = null;
  function annoncer(texte) {
    if (!statut) return;
    statut.textContent = texte;
    statut.classList.add("visible");
    if (minuterieStatut) clearTimeout(minuterieStatut);
    minuterieStatut = setTimeout(function () {
      statut.classList.remove("visible");
      statut.textContent = "";
    }, 4000);
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach(function (lien) {
    lien.addEventListener("click", function () {
      annoncer("Ouverture de votre messagerie… (adresse : contact@dju-lye.fr)");
    });
  });

  var btnCopier = document.getElementById("copier-mail");
  if (btnCopier) {
    btnCopier.addEventListener("click", function () {
      var adresse = btnCopier.getAttribute("data-mail") || "contact@dju-lye.fr";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(adresse).then(function () {
          annoncer("Adresse " + adresse + " copiée !");
        }, function () {
          annoncer("Adresse à copier : " + adresse);
        });
      } else {
        annoncer("Adresse à copier : " + adresse);
      }
    });
  }

  // 3. « Moins de mouvement » : rien ne bouge, pas de bouton pause.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var arretees = lire(CLE_ANIM) === "oui";
  var bouton = document.createElement("button");
  bouton.type = "button";
  bouton.id = "pause-animations";
  var libelle = document.createElement("span");
  libelle.className = "sr-seul";
  var icone = document.createElement("span");
  icone.className = "pause-icone";
  icone.setAttribute("aria-hidden", "true");
  bouton.append(libelle, icone);

  function afficherPause() {
    racine.classList.toggle("sans-animation", arretees);
    libelle.textContent = bouton.title = arretees ? "Reprendre les animations" : "Arrêter les animations";
  }
  bouton.addEventListener("click", function () {
    arretees = !arretees;
    ecrire(CLE_ANIM, arretees ? "oui" : "non");
    afficherPause();
  });
  afficherPause();
  racine.classList.add("avec-pause");
  document.body.appendChild(bouton);

  // 4. Yeux de la mascotte : suivent le curseur ou le doigt (immobiles si pause).
  var pupilles = Array.from(document.querySelectorAll(".pupille"));
  var cible = null;
  var attente = false;
  function regarder() {
    attente = false;
    pupilles.forEach(function (pupille) {
      var r = pupille.getBoundingClientRect();
      var dx = cible && !arretees ? cible.x - (r.left + r.width / 2) : 0;
      var dy = cible && !arretees ? cible.y - (r.top + r.height / 2) : 0;
      var force = Math.min(1, Math.hypot(dx, dy) / 250) * 3;
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
