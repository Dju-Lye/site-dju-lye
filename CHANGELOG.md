# Journal des modifications

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Pas encore de version publiée : les modifications sont regroupées sous « Non publié ».

## [Non publié]

### Ajouté
- Thème Geek « Pixels de quartier » entièrement refait (branche `theme-geek`, première vague) : Bip le robot, ciel de pixels, manette, vagues à pastilles, phrase écrite lettre par lettre, icônes de titres, jetons, bouton ▶, clignement du symbole de « Qui est Julie », sourire du logo tracé en 6 traits (`saisons/geek.css`, `js/geek.js`). Thème de repos, sans période.
- `index.html` : ornements vides `deco-theme` (Bip, manette), invisibles sans `geek.css` (règle dans `style.css`).
- Couche de saison : 21 fichiers de thème dans `saisons/` (`geek.css`, `halloween.css`, `lumieres-decembre.css`, `bonne-annee.css`, `galette.css`, `crepes.css`, `mots-doux.css`, `coin-du-feu.css`, `paques.css`, `au-jardin.css`, `fete-des-voisins.css`, `fete-de-la-musique.css`, `ete-pique-nique.css`, `carte-postale.css`, `rentree.css`, `feuilles-d-automne.css`, et les thèmes libres `dinosaure.css`, `extraterrestre.css`, `espace-lointain.css`, `agents-en-noir.css`, `michael-jackson.css`).
- `README.md` : mode d'emploi de la couche de saison, puis liste des fichiers avec leur période.

### Modifié
- Thème en ligne : `saisons/halloween.css`, à la place de `agents-en-noir.css`.
- Décor Halloween rangé dans `saisons/halloween.css` (37d7dba), à partir de `saison.css`.
- Retouches visuelles de plusieurs thèmes : Halloween (citrouille au-dessus du logo, sans chauves-souris), geek (noms de marque retirés du commentaire d'en-tête), crêpes, bonne année, galette, lumières de décembre, coin du feu, feuilles d'automne.

### Corrigé
- Mots doux : cœur dessiné une fois, un seul tracé dans le logo (3bc34cb).
