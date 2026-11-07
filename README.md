# Site vitrine Dju-Lye

Site vitrine statique (HTML/CSS, sans CMS, sans traceur) de Dju-Lye, aide numérique de quartier (micro-entreprise de Julie).

## Domaines

- dju-lye.fr (principal)
- djulye.fr (redirection vers dju-lye.fr)

Enregistrés chez Infomaniak le 29/10/2026.

## Charte graphique

`../charte-dju-lye/CHARTE.md` (à lire avant toute page).

## Organisation

Refonte neuve de novembre 2026 (branche `refonte-neuve-2026-11`) : site moderne, soigné et un peu technique, qui montre son propre travail. Le thème Geek et les 22 thèmes de saison ne sont plus chargés par la page ; leurs fichiers restent dans `saisons/` et `js/`, et dans l'historique git.

- `index.html` : page unique (accroche, le site en chiffres, services, déroulement, tarif, qui est Julie, contact), avec balises de partage (Open Graph, Twitter) et données structurées `LocalBusiness`.
- `mentions-legales.html` : mentions légales.
- `404.html`, `robots.txt`, `sitemap.xml` : page d'erreur, consignes aux robots, plan du site.
- `style.css` : feuille de style unique, variables de couleur sur `:root`, mode sombre automatique, révélation au défilement (`animation-timeline: view()`) avec repli complet sans mouvement.
- `js/site.js` : bouton pause des animations et découpage des titres en mots. Aucune bibliothèque.
- `polices/` : Lexend SemiBold, Source Sans 3 Regular et SemiBold, JetBrains Mono Regular (woff2, latin) et leurs licences OFL.
- `images/` : symbole, image de partage `og-image` (SVG et PNG 1200x630), icône tactile.
- `js/animations.js`, `js/geek.js`, thèmes de saison (`saisons/`, `js/*.js`, `js/vendor/`) : conservés, non chargés.

Le poids de la page affiché dans la bande de chiffres (122 Ko, sans compression : HTML, CSS, JS, polices, symbole) est une mesure : à refaire si un de ces fichiers change.

HTML, CSS et un petit JavaScript : aucun chargement externe, aucun traceur.

## État au 29/10/2026

- Page unique et mentions légales écrites, pas encore relues ni testées dans un navigateur.
- Mentions légales : éditeur, SIRET, adresse et hébergeur à compléter.
- Hébergement et DNS à faire.
- Limite : le logo est en SVG en ligne pour utiliser la police Lexend chargée par la page.

## Couche de saison

Le décor de fête est une feuille de style à part, dans `saisons/` (aujourd'hui `geek.css`, le thème de repos), chargée après `style.css`. La base du site n'est pas modifiée pour changer de fête.

Cinq emplacements :
1. au-dessus du logo (`.accroche .contenu::after`, ou un SVG en ligne pour le thème Geek : Bip) ;
2. ciel de l'en-tête, PC seulement dès 900 px (`.accroche .contenu::before`) ;
3. au-dessus de « Écrire à Julie » (`.ecrire h2::before`, ou un SVG en ligne pour le thème Geek : la manette) ;
4. couleur des vagues (`.courbe`) ;
5. phrase de saison (`<p class="saison">` dans `index.html`).

Fichiers disponibles dans `saisons/` :
- `geek.css` : « Pixels de quartier », thème de repos sans période (laissé en place hors fête), avec Bip le robot ; animé par `js/geek.js` (sourire en 6 traits, phrase écrite lettre par lettre) ; seconde vague : Bip qui visite le logo (PC), Bip du pied de page (jamais en même temps que celui du haut), cartes qui s'allument, jauge de lecture, tarif en score, et des œufs de Pâques décoratifs (code secret, 5 clics sur le logo, sommeil, pixel caché, rebond du « 25 € ») ; en ligne ;
- `halloween.css` : du 15 octobre au 2 novembre (retiré du site, fichier conservé) ;
- `lumieres-decembre.css` : du 1er au 25 décembre, bleu nuit, étoile filante animée par `js/lumieres-decembre.js` (à brancher avec son script, la classe `sourire-attendu` du `<head>` et la phrase ; pas encore en ligne) ;
- `bonne-annee.css` : du 26 décembre au 4 janvier (sans chiffre d'année, sert chaque année), champagne et rose poudré, bouchon de champagne animé par `js/bonne-annee.js` (à brancher avec son script, la classe `sourire-attendu` du `<head>` et la phrase ; pas encore en ligne) ;
- `galette.css` : du 5 au 18 janvier, brun beurre, fève qui se cache animée par `js/galette.js` (même branchement ; pas encore en ligne) ;
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

Changer de fête : dans `index.html`, remplacer le fichier du `<link>` (`saisons/noel.css`…), le texte de la phrase, et, si le thème a un script, la ligne `<script>` (`js/geek.js` pour le thème Geek). Le `<head>` cible le fichier du thème actif pour masquer le sourire avant son tracé. Les ornements vides de `index.html` (Bip, manette : classe `deco-theme`) restent invisibles sans `geek.css`.
Revenir au site sobre : supprimer la ligne `<link>` de la saison et vider la balise `<p class="saison">` (`style.css` la masque quand elle est vide).

Le bouton pause (`js/animations.js`, `style.css`) est une pastille ronde de 44 px en bas à droite, avec ⏸ ou ▶ dessiné en CSS ; son nom (« Arrêter les animations » / « Reprendre les animations ») est un libellé masqué. Il vaut pour tous les thèmes. Pause ou « moins de mouvement » arrêtent aussi les minuteurs et écouteurs de la seconde vague du thème Geek (`fin()`), la reprise les relance (`debut()`).

Règles : animations et JavaScript acceptés, GSAP hébergé en local. L'objectif du site est d'être moderne et soigné, tout en restant lisible, plus « simple dans le code ». Garde-fous : `prefers-reduced-motion` respecté, bouton pause pour tout mouvement de plus de 5 secondes, rien chargé depuis un serveur externe, pas de clignotement rapide. Décors en pseudo-éléments SVG en data URI (le `#` s'écrit `%23`), `pointer-events: none`, logo jamais déformé.

## Dépendance : GSAP

GSAP 3.15.0 (`js/vendor/gsap.min.js`), sous licence « Standard No Charge » : https://gsap.com/standard-license. Julie maintient cette dépendance : version fixée, mise à jour seulement avec son accord.

Plugins GSAP 3.15.0, mêmes conditions : `js/vendor/DrawSVGPlugin.min.js` (sourire du logo qui se dessine) et `js/vendor/MotionPathPlugin.min.js` (vol de la chauve-souris), utilisés par `js/halloween.js` (thème Halloween seulement ; `js/geek.js` utilise GSAP, DrawSVG et MotionPath (visite de Bip)) et, pour l'étoile filante, par `js/lumieres-decembre.js` (thème Lumières de décembre seulement). `js/bonne-annee.js` et `js/galette.js` n'utilisent que GSAP et DrawSVG (pas MotionPath).
