# Journal des modifications

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Pas encore de version publiée : les modifications sont regroupées sous « Non publié ».

## [Non publié]

### Refonte « Studio de proximité » (17/11/2026, charte v2 direction A + B)
- Nouvelle identité visuelle alignée sur `projets/charte-dju-lye/CHARTE.md` (v2) : mode clair par défaut (`#fbf6ec`), mode sombre (`#150d20`) activable par interrupteur (« Mode sombre / Mode clair ») dans l'en-tête et mémorisé dans `localStorage`, ombres colorées douces et en-tête vitré fixe avec liens d'ancrage.
- Mascotte Dju-Lye déclinée en 4 expressions SVG (accueil attentif, clin d'œil complice, sereine & patiente, ravie au survol) et 6 scènes illustrées en SVG multi-calques pour les cartes de services.
- Offre et tarif : retrait provisoire de toute mention du crédit d'impôt de 50 % et du montant de 25 €/h en attendant la finalisation du statut Services à la Personne (décision du 17/11/2026) ; mise en avant de l'initiation et de l'installation en tête des services ; tarif affiché à 50 €/h avec le détail de ce qui est inclus dans la séance.
- Nouveaux composants : section « Questions fréquentes » en accordéon (`<details>`), bouton « Copier l'adresse e-mail » en un clic à côté du bouton `mailto:`, message d'état explicite remplaçant le « merci ! » immédiat.
- Technique et légal : mention de franchise de TVA (`art. L. 223 et s. du CIBS`) et `<meta name="description">` ajoutées sur `mentions-legales.html` ; script d'application immédiate du thème et de la pause des animations présent dans le `<head>` des 3 pages (`index.html`, `mentions-legales.html`, `404.html`) ; paramètres de version `?v=2026-11-17` sur `style.css` et `js/site.js` ; `sitemap.xml` et poids mesuré (124 Ko / 123 788 octets) mis à jour.

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
