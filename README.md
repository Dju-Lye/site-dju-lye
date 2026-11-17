# Site vitrine Dju-Lye

Site vitrine statique (HTML/CSS, sans CMS, sans traceur) de Dju-Lye, aide numérique de quartier (micro-entreprise de Julie).

## Domaines

- dju-lye.fr (principal)
- djulye.fr (redirection vers dju-lye.fr)

Enregistrés chez Infomaniak le 29/10/2026.

## Charte graphique

`../charte-dju-lye/CHARTE.md` (à lire avant toute page).

## Organisation

Refonte « Studio de proximité » du 17 novembre 2026 (direction A + B de la charte v2) : mode clair par défaut (crème papier `#fbf6ec`, aubergine `#4a2a6e`, miel `#f5c33b`, menthe `#1db89a`, lilas `#e6dcff`, texte encre `#231730`), ombres colorées douces, en-tête vitré fixe et interrupteur vers le mode sombre (`#150d20`). La mascotte Dju-Lye est déclinée en 4 expressions (accueil, clin d'œil, sereine, ravie) et les 6 cartes de services sont illustrées par des scènes SVG multi-calques. Conformément à la décision du 17/11/2026, aucune mention du crédit d'impôt de 50 % n'est affichée tant que la déclaration Services à la Personne (Nova) n'est pas finalisée. Le thème Geek et les autres thèmes de saison (21 feuilles dans `saisons/`) restent conservés et non chargés.

- `index.html` : page unique (barre de navigation vitrée, accroche, 6 services illustrés, déroulement en 3 étapes, tarif à 50 €/h, qui est Julie, questions fréquentes en accordéon, contact avec copie de l'adresse en un clic, le site en chiffres), avec balises de partage (Open Graph, Twitter) et données structurées `LocalBusiness`.
- `mentions-legales.html` : mentions légales (SIRET et franchise de TVA renseignés).
- `404.html`, `robots.txt`, `sitemap.xml` : page d'erreur, consignes aux robots, plan du site.
- `style.css` : feuille de style unique, variables de couleur sur `:root` (clair par défaut) et `html[data-theme="sombre"]` (mode sombre), révélation au défilement (`animation-timeline: view()`) avec repli complet sans mouvement.
- `js/site.js` : bascule Mode clair / Mode sombre (`localStorage`, clé `theme-dju-lye`), copie de `contact@dju-lye.fr` en un clic et annonce d'ouverture de messagerie, bouton pause des animations (absent avec « moins de mouvement ») et pupilles de la mascotte qui suivent le curseur. Aucune bibliothèque. Un petit script en ligne dans le `<head>` de chaque page applique le thème et la pause mémorisés avant le premier rendu.
- `polices/` : Lexend SemiBold, Source Sans 3 Regular, JetBrains Mono Regular (Source Sans 3 SemiBold n'est plus chargée) (woff2, latin) et leurs licences OFL.
- `images/` : symbole, image de partage `og-image` (SVG et PNG 1200x630), icône tactile.
- `js/animations.js`, `js/geek.js`, thèmes de saison (`saisons/`, `js/*.js`, `js/vendor/`) : conservés, non chargés.

Le poids de la page affiché dans la bande de chiffres (124 Ko, soit 123 788 octets mesurés avec `wc -c`, sans compression : HTML, CSS, JS, polices chargées, symbole) est une mesure : à refaire si un de ces fichiers change.

HTML, CSS et un petit JavaScript : aucun chargement externe, aucun traceur.

## État

- Page unique et mentions légales écrites ; SIRET et mention de franchise de TVA renseignés dans les mentions légales.
- Site en ligne sur https://dju-lye.fr (GitHub Pages).
- Le logo est en SVG en ligne dans `index.html` et `mentions-legales.html`, pour s'adapter au thème clair/sombre et utiliser la police Lexend chargée par la page.

## Thèmes de saison (archivés, non chargés)

Les feuilles de `saisons/` ont été écrites pour l'ancienne page (`.accroche`, `<p class="saison">`, ornements `deco-theme`, vagues) : aucune n'est branchée sur la page actuelle, et elles seraient à adapter avant de les recharger. `saisons/GUIDE-DE-STYLE.md` décrit leur style.

Fichiers disponibles dans `saisons/` :
- `geek.css` : « Pixels de quartier », thème de repos sans période (laissé en place hors fête), avec Bip le robot ; animé par `js/geek.js` (sourire en 6 traits, phrase écrite lettre par lettre) ; seconde vague : Bip qui visite le logo (PC), Bip du pied de page (jamais en même temps que celui du haut), cartes qui s'allument, jauge de lecture, tarif en score, et des œufs de Pâques décoratifs (code secret, 5 clics sur le logo, sommeil, pixel caché, rebond du « 25 € ») ;
- `halloween.css` : du 15 octobre au 2 novembre (fichier conservé) ;
- `lumieres-decembre.css` : du 1er au 25 décembre, bleu nuit, étoile filante animée par `js/lumieres-decembre.js` (à brancher avec son script) ;
- `bonne-annee.css` : du 26 décembre au 4 janvier (sans chiffre d'année, sert chaque année), champagne et rose poudré, bouchon de champagne animé par `js/bonne-annee.js` (à brancher avec son script) ;
- `galette.css` : du 5 au 18 janvier, brun beurre, fève qui se cache animée par `js/galette.js` (même branchement) ;
- `crepes.css` : du 28 janvier au 10 février ;
- `mots-doux.css` : du 11 au 15 février ;
- `coin-du-feu.css` : du 16 février au 7 mars ;
- `paques.css` : Pâques et les œufs, du 22 mars au 5 avril (dates 2027, à recalculer chaque année) ;
- `au-jardin.css` : du 6 avril au 19 mai ;
- `fete-des-voisins.css` : du 20 au 31 mai ;
- `fete-de-la-musique.css` : du 15 au 22 juin ;
- `ete-pique-nique.css` : du 23 juin au 31 juillet ;
- `carte-postale.css` : du 1er au 29 août ;
- `rentree.css` : du 30 août au 20 septembre ;
- `feuilles-d-automne.css` : du 21 septembre au 14 octobre ;
- `dinosaure.css` : thème libre, sans période ;
- `extraterrestre.css` : thème libre, sans période ;
- `espace-lointain.css` : thème libre, sans période ;
- `agents-en-noir.css` : thème libre, sans période ;
- `mj.css` : thème libre, sans période.
La phrase de saison de chaque fichier est en commentaire en tête.

## Règles

Animations et JavaScript acceptés. L'objectif du site est d'être moderne et soigné, tout en restant lisible. Garde-fous : `prefers-reduced-motion` respecté (aucun mouvement, pas de bouton pause), bouton pause pour les animations, rien chargé depuis un serveur externe, pas de clignotement rapide.

Le bouton pause (créé par `js/site.js`, styles dans `style.css`) est une pastille ronde de 44 px, fixe en bas à droite sur PC et en bas de page sur mobile ; son nom (« Arrêter les animations » / « Reprendre les animations ») est un libellé masqué. Le choix est gardé dans `localStorage`.

## Dépendance : GSAP

GSAP 3.15.0 (`js/vendor/gsap.min.js`), sous licence « Standard No Charge » : https://gsap.com/standard-license. Non chargée par la page actuelle ; conservée pour les thèmes archivés. Julie maintient cette dépendance : version fixée, mise à jour seulement avec son accord.

Plugins GSAP 3.15.0, mêmes conditions : `js/vendor/DrawSVGPlugin.min.js` (sourire du logo qui se dessine) et `js/vendor/MotionPathPlugin.min.js` (vol de la chauve-souris), utilisés par `js/halloween.js` (thème Halloween seulement ; `js/geek.js` utilise GSAP, DrawSVG et MotionPath (visite de Bip)) et, pour l'étoile filante, par `js/lumieres-decembre.js` (thème Lumières de décembre seulement). `js/bonne-annee.js` et `js/galette.js` n'utilisent que GSAP et DrawSVG (pas MotionPath).
