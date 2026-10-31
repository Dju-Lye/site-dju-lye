# Guide de style des thèmes de saison

Un seul dossier `saisons/` : ce guide y vit (le dossier `docs/` n'existait pas). Valable pour tous les thèmes ; Halloween est le premier mis au style.

## Règles
- Formes rondes, trapues, coins arrondis (`stroke-linejoin: round`), jamais pointues ni fines. Chaque objet reste lisible à 28 px.
- Liseré blanc `#ffffff` de 1,5 px, `vector-effect: non-scaling-stroke`, sur tous les objets de saison (plus de contour aubergine).
- Remplissage : une couleur du thème, plus claire que le fond ; aubergine clair `#6b4a91` ou `#8e6bb5` pour les parties secondaires.
- Visage : deux yeux blancs ronds et un sourire miel `#f5c33b` arrondi, seulement à partir de 40 px. Jamais de bouche ouverte ni de crocs.
- Opacité du décor fixe à 0,6 ; objets proches du logo à 1 ; le texte n'est jamais recouvert.
- Fil conducteur aubergine, miel, blanc. Chaque thème a ses propres couleurs (2 couleurs et 1 accent) ; Halloween : orange `#f28c28` pour les citrouilles et la visiteuse.
- Mouvements lents (6 à 9 s), faible amplitude, un seul élément qui bouge à la fois, aucun clignotement ; les halos ne varient qu'en opacité.
- Une seule visiteuse par thème, animée par GSAP, qui rend visite au logo puis s'efface. Tout le reste est fixe, en data URI.
- `prefers-reduced-motion` coupe tout (CSS et pause globale GSAP). Rien d'externe.
- Poids : un thème pèse moins de 12 Ko de CSS.

## Kit de symboles
Une data URI ne partage rien avec le HTML ni avec un autre fichier. Le kit est donc une bibliothèque de chemins à copier dans le `<defs>` de chaque image : yeux (cercles blancs), sourire (arc miel), liseré, aile, corps rond, étoile ronde, flamme, rond, croissant. Seuls l'aile, le corps, la citrouille et le croissant sont dessinés pour l'instant ; les autres s'ajoutent avec les thèmes.

## Chauve-souris (repère 0,0 = centre du corps, largeur 56)
- Aile droite (l'aile gauche est la même avec `transform="scale(-1 1)"`) : `M6.5 -2 C12 -8 20 -9 26 -5 Q27.5 -3.5 25.5 -2 Q22.5 -0.5 22 2 Q22 4 20 4.5 Q17.5 3 15.5 6 Q14 7.5 12.5 6 Q10 4 7 6 Z`
- Corps : `M-7 -3 Q-7.5 -9 -4.5 -8.5 Q-2 -7.2 0 -7.2 Q2 -7.2 4.5 -8.5 Q7.5 -9 7 -3 Q8.5 1 7 5 Q4 9 0 9 Q-4 9 -7 5 Q-8.5 1 -7 -3 Z`
- Visage (seulement à 40 px et plus) : yeux `circle cx=±3.2 cy=-1 r=1.9` blancs ; sourire `M-2.6 3.2 Q0 6 2.6 3.2`, miel, trait 1,4.

## Citrouille (viewBox 0 0 48 48)
- 3 lobes orange `#f28c28` : ellipses `(14,29) 10x13`, `(34,29) 10x13`, `(24,29) 9,5x14`, liseré blanc 1,5 px.
- Queue aubergine clair `#6b4a91` : `M24 15 Q24 10 29 9`, trait 3,2 arrondi sur un trait blanc de 6.
- Visage (40 px et plus) : yeux blancs `circle (18,27) et (30,27) r=2.4` ; sourire miel `M18 34 Q24 39 30 34`, trait 2,6.
- Dans `halloween.css`, la citrouille est définie une fois (`--citrouille`) ; la version sans visage (`--citrouille-nue`) sert aux objets de moins de 40 px.

Chemin complet de la citrouille avec visage :
```
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><g fill='#f28c28' stroke='#ffffff' stroke-width='1.5' stroke-linejoin='round' vector-effect='non-scaling-stroke'><ellipse cx='14' cy='29' rx='10' ry='13'/><ellipse cx='34' cy='29' rx='10' ry='13'/><ellipse cx='24' cy='29' rx='9.5' ry='14'/></g><path d='M24 15 Q24 10 29 9' fill='none' stroke='#ffffff' stroke-width='6' stroke-linecap='round'/><path d='M24 15 Q24 10 29 9' fill='none' stroke='#6b4a91' stroke-width='3.2' stroke-linecap='round'/><circle cx='18' cy='27' r='2.4' fill='#ffffff'/><circle cx='30' cy='27' r='2.4' fill='#ffffff'/><path d='M18 34 Q24 39 30 34' fill='none' stroke='#f5c33b' stroke-width='2.6' stroke-linecap='round'/></svg>
```
