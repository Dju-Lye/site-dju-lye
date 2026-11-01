# Guide de style des thèmes de saison

Un seul dossier `saisons/` : ce guide y vit (le dossier `docs/` n'existait pas). Valable pour tous les thèmes ; Halloween est le premier mis au style.

## Règles
- Formes rondes, trapues, coins arrondis (`stroke-linejoin: round`), jamais pointues ni fines. Chaque objet reste lisible à 28 px.
- Liseré blanc `#ffffff` de 1,5 px, `vector-effect: non-scaling-stroke`, sur tous les objets de saison (plus de contour aubergine). Exception : le liseré de la vague est volontairement fin (environ 0,75 px visible de chaque côté du trait). Le liseré blanc (et la lune pâle) ne valent que sur fond aubergine ; sur fond crème, on n'utilise pas de liseré blanc.
- Remplissage : une couleur du thème, plus claire que le fond ; aubergine clair `#6b4a91` ou `#8e6bb5` pour les parties secondaires.
- Visage : deux yeux blancs ronds et un sourire miel `#f5c33b` arrondi, seulement à partir de 40 px. Jamais de bouche ouverte ni de crocs.
- Opacité du décor flottant du ciel fixe à 0,6 ; objets proches du logo à 1 ; les objets de la vague et la citrouille du bas de page restent aussi à 1 ; le texte n'est jamais recouvert.
- Fil conducteur aubergine, miel, blanc. Chaque thème a ses propres couleurs (2 couleurs et 1 accent) ; Halloween : orange `#f28c28` pour les citrouilles et la visiteuse.
- Mouvements lents (6 à 9 s), faible amplitude, un seul mouvement principal ; deux mouvements très lents et de très faible amplitude peuvent coexister si l'un est une respiration sur place ; aucun clignotement ; les halos ne varient qu'en opacité.
- Scintillement (Lumières de décembre, ampoules du ciel seulement) : deux couches d'ampoules (`.accroche .contenu::before` et `.accroche::before`) alternent en opacité entre 1 et 0,7, 5 s par sens, en opposition de phase ; jamais de flash ni de blanc plein, coupé comme les autres animations CSS (moins de mouvement, bouton pause).
- Une seule visiteuse par thème, animée par GSAP, qui rend visite au logo puis s'efface. Tout le reste est fixe, en data URI.
- Visiteuse (PC seulement, dès 900 px) : environ 56 px d'envergure, voisine du logo (à côté, pas perchée), posée à une distance égale à la moitié de la hauteur du symbole du logo mesurée à l'écran. Sa trajectoire reste hors du décor (chauves-souris, lune, citrouille, logo, texte). Tout est calculé depuis le logo mesuré et recalculé à chaque redimensionnement (`gsap.matchMedia`, avec nettoyage) ; rien en px fixes. Le vol ne doit jamais créer de défilement horizontal : l'en-tête `.accroche` porte `overflow-x: clip` (pas `hidden`, pour ne pas rogner le débordement vertical du logo).
- Un élément du logo masqué avant son animation (le sourire) l'est par une classe posée dans le `<head>` et retirée par le script ou après 3 s : jamais sans repli.
- `prefers-reduced-motion` coupe tout (CSS et pause globale GSAP). Rien d'externe.
- Poids : un thème pèse moins de 12 Ko de CSS. Exception validée par Julie : le thème Geek n'est pas limité.

## Kit de symboles
Une data URI ne partage rien avec le HTML ni avec un autre fichier. Le kit est donc une bibliothèque de chemins à copier dans le `<defs>` de chaque image : yeux (cercles blancs), sourire (arc miel), liseré, aile, corps rond, étoile ronde, flamme, rond, croissant. Dessinés pour l'instant : l'aile, le corps, la citrouille, le croissant (Halloween), l'étoile ronde, la flamme, le rond (ampoule) et la bougie (Lumières de décembre) ; les autres s'ajoutent avec les thèmes.

## Chauve-souris (repère 0,0 = centre du corps, largeur 56)
- Aile droite (l'aile gauche est la même avec `transform="scale(-1 1)"`) : `M6.5 -2 C12 -8 20 -9 26 -5 Q27.5 -3.5 25.5 -2 Q22.5 -0.5 22 2 Q22 4 20 4.5 Q17.5 3 15.5 6 Q14 7.5 12.5 6 Q10 4 7 6 Z`
- Corps : `M-7 -3 Q-7.5 -9 -4.5 -8.5 Q-2 -7.2 0 -7.2 Q2 -7.2 4.5 -8.5 Q7.5 -9 7 -3 Q8.5 1 7 5 Q4 9 0 9 Q-4 9 -7 5 Q-8.5 1 -7 -3 Z`
- Visage (seulement à 40 px et plus) : yeux `circle cx=±3.2 cy=-1 r=1.9` blancs ; sourire `M-2.6 3.2 Q0 6 2.6 3.2`, miel, trait 1,4.

## Citrouille (viewBox 0 0 48 48)
- 3 lobes orange `#f28c28` : ellipses `(14,29) 10x13`, `(34,29) 10x13`, `(24,29) 9,5x14`, liseré blanc 1,5 px.
- Queue aubergine clair `#6b4a91` : `M24 15 Q24 10 29 9`, trait 3,2 arrondi sur un trait blanc de 6.
- Visage (40 px et plus) : yeux blancs `circle (18,27) et (30,27) r=2.4` ; sourire miel `M18 34 Q24 39 30 34`, trait 2,6.
- Dans `halloween.css` (`:root`), le corps de la citrouille est défini une seule fois (`--citrouille-nue`, sans visage, pour les objets de moins de 40 px) ; `--citrouille` ajoute devant lui une couche yeux et sourire. La tuile de la vague en garde une copie, car une data URI ne peut rien partager.
- Chemin complet : voir les variables `--citrouille-nue` (corps) et `--citrouille` (visage) dans `saisons/halloween.css`.

## Étoile, flamme, ampoule (Lumières de décembre, viewBox 0 0 48 48)
- Étoile ronde : cinq branches trapues (rayon 21 et 11,5 autour de (24 ; 25,5)), bouts arrondis par des courbes Q ; miel `#f5c33b`, liseré blanc 1,5 px. Visage seulement à 40 px et plus ; sur le miel, yeux et sourire sont aubergine `#4a2a6e` (blanc et miel y seraient invisibles). Flocons : même étoile, crème, petite taille, sans visage. Voir `--etoile-nue` et `--etoile` dans `saisons/lumieres-decembre.css`.
- Ampoule (rond) : cercle `(24,29) r=14` et culot arrondi `rect 18,6 12x11 rx 3,5`, aubergine clair `#6b4a91`, liseré blanc ; sans visage (vagues 24 px, puce 28 px, guirlande).
- Flamme : goutte arrondie miel au-dessus d'une bougie (corps arrondi aubergine clair, visage blanc et miel à 56 px) : voir `--bougie`.
- Étoile filante (visiteuse) : étoile miel de 28 px sans visage, queue de quatre ronds miel qui s'effacent, SVG créé par `js/lumieres-decembre.js`.

## Bonne année et La galette (viewBox 0 0 48 48)
- Bonne année (`saisons/bonne-annee.css`, fond aubergine inchangé) : étoile ronde du kit en champagne `#f1d9a0` avec visage aubergine (40 px) ; bouquet de 56 px (rond épais rose poudré `#e8a0b0` à visage, deux étoiles rondes miel, trois ronds épais lilas ou miel) ; confettis = pastilles rondes de 4 tailles (ciel, opacité 0,6, haut du ciel seulement) ; vagues : trait lilas, étoile ronde rose tous les 120 px (24 px) ; puce : étoile ronde rose sans visage.
- Visiteuse de Bonne année : bouchon de champagne de 22 x 24 px (tête champagne, collerette rose, sans visage), SVG créé par `js/bonne-annee.js` ; au plus deux passages par visite de la page, bond de 12 px (translateY), six confettis qui se posent dans la zone sûre mesurée (entre le milieu du logo et le premier texte, hors ciel).
- La galette (`saisons/galette.css`, fond brun beurre `#5c3d1e` à la place de l'aubergine, comme Lumières avec son bleu nuit) : part de galette ronde et trapue (crème doré `#f7e2a8`, croûte miel, visage aubergine, 40 px) ; couronne arrondie remplie miel avec 3 boules blanches fixes (ciel) ; fève ronde (ellipse 19 x 17, miel, visage aubergine à 56 px ; crème doré dans les vagues ; sans visage en puce) ; vague : trait miel en dents arrondies (demi-cercles de 15 px), fève ronde tous les 120 px.
- Visiteuse de La galette : la fève qui se cache, SVG de 44 px créé par `js/galette.js`, posée contre la couronne du ciel (position calculée depuis la boîte du ciel, 1 unité = 0,1 rem), derrière lui (z-index -1) ; fondu d'opacité de 2,5 s et 3 s, cycle de 19 s, rattachée à la pause globale.
- Nouvelles pièces au kit : bouquet, couronne, part de galette, fève, bouchon (voir les variables `--bouquet`, `--part`, `--feve` et le SVG du script).

## Geek, « Pixels de quartier » (`saisons/geek.css`, `js/geek.js`) : thème de repos, sans période
- Palette : nuit aubergine `#2a1646` (remplace l'aubergine des sections sombres et des vagues), aubergine clair `#6b4a91` et `#8e6bb5`, miel `#f5c33b`, menthe `#7ee0b5`, rose bonbon `#ff8fb1`, crème `#fbf5e6`. Menthe et rose : fonds sombres et décors seulement, jamais en texte sur fond clair. Fil aubergine et miel conservé. Contrastes : blanc sur nuit 16,1 ; miel sur nuit 9,8 ; aubergine sur miel 6,9 ; aubergine sur menthe 7,2.
- Exceptions validées par Julie : poids du CSS non limité à 12 Ko pour ce thème ; un seul personnage, Bip, qui pourra apparaître à deux endroits mais jamais en même temps (pas de visiteuse GSAP : Bip est un habitant, animé en CSS).
- Bip (viewBox 0 0 48 52, SVG en ligne dans `index.html`, classe `deco-theme bip`) : corps rond-carré `rect 7,15 34x27 rx10` aubergine clair `#6b4a91`, liseré blanc 1,5 px ; yeux blancs `r 3,4` en (17,5 ; 27) et (30,5 ; 27) ; sourire miel `M18.5 34 Q24 38.5 29.5 34`, trait 2,4, jamais de bouche ouverte ; deux pieds et deux bras arrondis ; antenne `M24 16 L24 8` à bout rond, qui s'allume par l'opacité seule (`.bip-lampe`). Coucou : le bras droit (`.bip-bras`) se lève toutes les 10 s.
- Manette générique : corps rond `#6b4a91`, croix crème, deux boutons ronds (rose, menthe) posés sur un fond nuit ; le bouton rose s'enfonce de 1,6 px quand on survole « Écrire à Julie » (dès 900 px, `:has`).
- Ciel (PC, dès 900 px) : étoiles-pixels en carrés à coins arrondis (rx 0,8 à 1), manette, disquette générique ; opacité 0,6, dérive de 4 px en 9 s.
- Pixels : carrés `rx` arrondis, ou croix arrondies pour les étoiles ; vagues en pastilles menthe et miel avec liseré blanc, défilement de 120 px en 80 s.
- Mouvement : au plus 3 changements par seconde pour un élément ; fondus lents ; curseur ▌ à 1 Hz en fondu ; jeton qui se retourne (rotateY jusqu'à la tranche et retour, 1,2 s) ; phrase de saison qui s'écrit lettre par lettre quand elle entre à l'écran (copie visible `aria-hidden`, texte complet gardé pour les lecteurs d'écran) ; animations arrêtées en cours de route : phrase et sourire terminés d'un coup.
- Sous 900 px : pas de ciel, manette fixe (le bouton ne bouge pas).
