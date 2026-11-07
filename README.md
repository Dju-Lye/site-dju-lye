# Site vitrine Dju-Lye

Site vitrine statique (HTML/CSS, sans CMS, sans traceur) de Dju-Lye, aide numérique de quartier (micro-entreprise de Julie).

## Domaines

- dju-lye.fr (principal)
- djulye.fr (redirection vers dju-lye.fr)

Enregistrés chez Infomaniak le 29/10/2026.

## Charte graphique

`../charte-dju-lye/CHARTE.md` (à lire avant toute page).

## Organisation

Refonte neuve de novembre 2026 (branche `refonte-neuve-2026-11`) : maquette B « Pop de quartier » (branche `maquette-b-pop-de-quartier`) : fond crème, aplats saturés, contours épais, ombres dures, mascotte (le sourire du logo), ruban de mots, patchwork de services. Palette étendue : corail #ff5d8f, menthe #3de0c2, lilas #c9b6ff, crème #fdf2d9, encre #170f21. Le thème Geek et les autres thèmes de saison (21 feuilles dans `saisons/`) ne sont plus chargés par la page ; leurs fichiers restent dans `saisons/` et `js/`, et dans l'historique git.

- `index.html` : page unique (accroche, le site en chiffres, services, déroulement, tarif, qui est Julie, contact), avec balises de partage (Open Graph, Twitter) et données structurées `LocalBusiness`.
- `mentions-legales.html` : mentions légales.
- `404.html`, `robots.txt`, `sitemap.xml` : page d'erreur, consignes aux robots, plan du site.
- `style.css` : feuille de style unique, variables de couleur sur `:root`, pas de mode sombre dans cette maquette, révélation au défilement (`animation-timeline: view()`) avec repli complet sans mouvement.
- `js/site.js` : bouton pause des animations (absent avec « moins de mouvement ») et découpage des titres en mots. Aucune bibliothèque. Un petit script en ligne dans le `<head>` de `index.html` applique la pause mémorisée (`localStorage`, clé `animations-arretees`) avant le premier rendu.
- `polices/` : Lexend SemiBold, Source Sans 3 Regular, JetBrains Mono Regular (Source Sans 3 SemiBold n'est plus chargée) (woff2, latin) et leurs licences OFL.
- `images/` : symbole, image de partage `og-image` (SVG et PNG 1200x630), icône tactile.
- `js/animations.js`, `js/geek.js`, thèmes de saison (`saisons/`, `js/*.js`, `js/vendor/`) : conservés, non chargés.

Le poids de la page affiché dans la bande de chiffres (104 Ko, sans compression : HTML, CSS, JS, polices chargées, symbole) est une mesure : à refaire si un de ces fichiers change.

HTML, CSS et un petit JavaScript : aucun chargement externe, aucun traceur.

## État

- Page unique et mentions légales écrites ; SIRET « en cours d'attribution » dans les mentions légales.
- Hébergement et DNS à faire.
- Le logo est en SVG en ligne dans `index.html`, pour utiliser la police Lexend chargée par la page.

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
