# Journal des modifications

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Pas encore de version publiée : les modifications sont regroupées sous « Non publié ».

## [Non publié]

### Refonte neuve (branche `refonte-neuve-2026-11`)
- Site réécrit : très grands titres Lexend en taille fluide avec mot clé miel, étiquettes et chiffres en JetBrains Mono, bande « le site en chiffres » (valeurs mesurées), sections qui se dévoilent au défilement en CSS seul (titres mot par mot, fil miel qui relie les 3 étapes, remboursement du tarif en second), mode sombre automatique.
- Partage et référencement : Open Graph, Twitter, canonical, `theme-color`, JSON-LD `LocalBusiness` (sans adresse de domicile), `robots.txt`, `sitemap.xml`, `404.html`, `images/og-image` (SVG et PNG), icône tactile.
- `js/site.js` remplace `js/animations.js` (pause des animations conservée, sans GSAP) ; `polices/JetBrainsMono-Regular.woff2` et sa licence OFL.
- `mentions-legales.html` raccordée au nouveau style (texte inchangé).
- Thème Geek, thèmes de saison et GSAP ne sont plus chargés ; fichiers conservés.
- Corrections après relecture : pas de bouton pause avec « moins de mouvement », pause mémorisée appliquée avant le premier rendu (script en ligne du `<head>`), lien d'évitement vers `<main id="contenu">` focusable, règles et doublons CSS inutiles retirés, `robots.txt` simplifié, README mis d'accord avec la branche.

### Ajouté
- Thème Geek « Pixels de quartier » entièrement refait (branche `theme-geek`, première vague) : Bip le robot, ciel de pixels, manette, vagues à pastilles, phrase écrite lettre par lettre, icônes de titres, jetons, bouton ▶, clignement du symbole de « Qui est Julie », sourire du logo tracé en 6 traits (`saisons/geek.css`, `js/geek.js`). Thème de repos, sans période.
- Thème Geek, seconde vague (branche `theme-geek`) : Bip visite le logo (PC, GSAP + MotionPath, petits pas), Bip du pied de page (jamais animé en même temps que celui du haut), cartes de services qui s'allument (pictogrammes-pixels, CSS seul), jauge de lecture en pastilles avec « Bip a tout lu », tarif « en score » (compteur de 0 à 50 en 4 paliers, « → 25 € » en décor), œufs de Pâques décoratifs : code secret, 5 clics sur le logo, Bip qui s'endort après 60 s, pixel caché au clavier, rebond du « 25 € ».
- `index.html` : yeux et « z z z » de Bip repérables par classe (`bip-oeil`, `bip-z`).
- `index.html` : ornements vides `deco-theme` (Bip, manette), invisibles sans `geek.css` (règle dans `style.css`).
- Couche de saison : 21 fichiers de thème dans `saisons/` (`geek.css`, `halloween.css`, `lumieres-decembre.css`, `bonne-annee.css`, `galette.css`, `crepes.css`, `mots-doux.css`, `coin-du-feu.css`, `paques.css`, `au-jardin.css`, `fete-des-voisins.css`, `fete-de-la-musique.css`, `ete-pique-nique.css`, `carte-postale.css`, `rentree.css`, `feuilles-d-automne.css`, et les thèmes libres `dinosaure.css`, `extraterrestre.css`, `espace-lointain.css`, `agents-en-noir.css`, `michael-jackson.css`).
- `README.md` : mode d'emploi de la couche de saison, puis liste des fichiers avec leur période.

### Modifié
- Thème libre `michael-jackson.css` renommé `mj.css` (nom « MJ »), dessin inchangé.
- Thème Geek (`js/geek.js`, `saisons/geek.css`) : la pause retire aussi le « Bonus ! » du « 25 € » et le minuteur de redimensionnement (fonctions `ecouter` et `minuter`, qui enregistrent leur propre annulation) ; rebond du « 25 € » ralenti à 2,4 s et saut du pied de Bip à 1 s (au plus 3 changements de sens par seconde) ; une seule liste d'éléments à arrêter ; constantes nommées en tête de fichier ; règle `.saison .sr-seul` en doublon retirée.
- Bouton « Arrêter les animations » : pastille ronde de 44 px en bas à droite, translucide, symbole ⏸ ou ▶ dessiné en CSS, nom accessible conservé (libellé masqué `.sr-seul`, `title`), pour tous les thèmes (`style.css`, `js/animations.js`).
- Thème Geek : le bond de Bip ne garde plus son style final (`backwards` au lieu de `both`), pour laisser GSAP déplacer Bip.
- Thème en ligne : `saisons/halloween.css`, à la place de `agents-en-noir.css`.
- Décor Halloween rangé dans `saisons/halloween.css` (37d7dba), à partir de `saison.css`.
- Retouches visuelles de plusieurs thèmes : Halloween (citrouille au-dessus du logo, sans chauves-souris), geek (noms de marque retirés du commentaire d'en-tête), crêpes, bonne année, galette, lumières de décembre, coin du feu, feuilles d'automne.

### Corrigé
- Mots doux : cœur dessiné une fois, un seul tracé dans le logo (3bc34cb).
