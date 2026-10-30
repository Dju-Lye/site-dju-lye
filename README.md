# Site vitrine Dju-Lye

Site vitrine statique (HTML/CSS, sans CMS, sans traceur) de Dju-Lye, aide numérique de quartier (micro-entreprise de Julie).

## Domaines

- dju-lye.fr (principal)
- djulye.fr (redirection vers dju-lye.fr)

Enregistrés chez Infomaniak le 29/10/2026.

## Charte graphique

`../charte-dju-lye/CHARTE.md` (à lire avant toute page).

## Organisation

- `index.html` : page unique (accroche, services, déroulement, tarif, qui est Julie, contact).
- `mentions-legales.html` : mentions légales, avec des marqueurs « À compléter ».
- `style.css` : feuille de style unique, mobile d'abord, mise en page élargie dès 48 em.
- `polices/` : Lexend SemiBold, Source Sans 3 Regular et SemiBold (woff2, latin seulement, tirées de la charte) et leurs licences OFL.
- `images/` : symbole (copie du SVG de la charte).

HTML et CSS seulement : aucun JavaScript, aucun chargement externe.

## État au 29/10/2026

- Page unique et mentions légales écrites, pas encore relues ni testées dans un navigateur.
- Mentions légales : éditeur, SIRET, adresse et hébergeur à compléter.
- Hébergement et DNS à faire.
- Limite : le logo est en SVG en ligne pour utiliser la police Lexend chargée par la page.

## Couche de saison

Le décor de fête est une feuille de style à part, dans `saisons/` (aujourd'hui `halloween.css`), chargée après `style.css`. La base du site n'est pas modifiée pour changer de fête.

Cinq emplacements :
1. au-dessus du logo (`.accroche .contenu::after`) ;
2. ciel de l'en-tête, PC seulement dès 900 px (`.accroche .contenu::before`) ;
3. au-dessus de « Écrire à Julie » (`.ecrire h2::before`) ;
4. couleur des vagues (`.courbe`) ;
5. phrase de saison (`<p class="saison">` dans `index.html`).

Fichiers disponibles dans `saisons/` :
- `geek.css` : geek rétro, du 3 au 30 novembre (à venir) ;
- `halloween.css` : du 15 octobre au 2 novembre (en ligne) ;
- `lumieres-decembre.css` : du 1er au 25 décembre ;
- `bonne-annee.css` : du 26 décembre au 4 janvier (sans chiffre d'année, sert chaque année) ;
- `galette.css` : du 5 au 18 janvier ;
- `crepes.css` : du 28 janvier au 10 février ;
- `mots-doux.css` : du 11 au 15 février ;
- `coin-du-feu.css` : du 16 février au 7 mars ;
- `paques.css` : Pâques et les œufs, du 22 mars au 5 avril (dates 2027, à recalculer chaque année) ;
- `au-jardin.css` : du 6 avril au 19 mai.
La phrase de saison de chaque fichier est en commentaire en tête.

Changer de fête : dans `index.html`, remplacer le fichier du `<link>` (`saisons/noel.css`…) et le texte de la phrase.
Revenir au site sobre : supprimer la ligne `<link>` de la saison et vider la balise `<p class="saison">` (`style.css` la masque quand elle est vide).

Règles : aucune animation ni JavaScript, rien qui gêne la lecture, décors en pseudo-éléments SVG en data URI (le `#` s'écrit `%23`), `pointer-events: none`, logo jamais déformé.
