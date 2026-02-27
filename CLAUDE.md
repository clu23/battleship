# CLAUDE.md — Battleship (The Odin Project)

## Contexte
Jeu de bataille navale en JavaScript vanilla pour The Odin Project.
Approche TDD. Joueur humain vs ordinateur.
Specs du projet : https://www.theodinproject.com/lessons/node-path-javascript-battleship
Règles du jeu : https://en.wikipedia.org/wiki/Battleship_(game)

## Stack
- Webpack 5 (bundler, entry: src/modules/main.js, output: dist/)
  - css-loader pour les CSS
  - asset/resource pour images (png, jpg) et sons (mp3) → dist/img/
- Jest 29 (tests unitaires, 66 tests) avec Babel pour la conversion ESM → CJS
- Vanilla JS (ES6 modules, pas de framework)
- CSS custom (pas de Tailwind/Bootstrap)
- Police : Big Shoulders Stencil Text (Google Fonts, déjà dans index.html)

## Architecture

```
src/modules/
├── factories/              # Logique métier pure (ZÉRO DOM ici)
│   ├── ship.js             # Classe Ship : size, name, hits, sunk, hit(), isSunk()
│   ├── gameboard.js        # Classe GameBoard : grille 10x10, shipMap, placement,
│   │                       #   takeHit, getShipAt, isGameOver
│   ├── player.js           # Classe Player : hitCoords (Set), alreadyHit()
│   ├── ai.js               # Classe AI : easy/medium/hard, getNextMove(), recordResult()
│   └── game.js             # Classe Game : playerBoard + computerBoard, switchTurn(), reset()
├── gameController.js       # Orchestrateur setup→battle→over (pas de DOM)
│                           #   playerAttack(), computerTurn(), getSunkShipPositions()
├── DOM/                    # Tout ce qui touche au DOM
│   ├── display.js          # Écran d'accueil, bouton Play, setPlayerName
│   ├── setup.js            # Orchestrateur phase placement (mince) : wiring dock + dragDrop
│   ├── dock.js             # Dock bateaux (SVGs, labels) + helpers grille joueur
│   │                       #   getCellsForShip, renderShipOnGrid, removeShipFromDock
│   │                       #   boutons Rotate/Random/Reset/Start Battle
│   ├── dragDrop.js         # Drag & drop : onDragStart/End, preview vert/rouge, onDrop
│   ├── battle.js           # Phase battle : grille ennemie, attaques, hit/miss/coulé,
│   │                       #   radar, messages typewriter, game over overlay
│   ├── scorePanel.js       # Score panels : liste bateaux coulés joueur + ennemi
│   └── support.js          # Helpers génériques : createMap(), createBoard(), coords utils
├── utils/
│   ├── sound.js            # Musique de fond pirates.mp3 (lancée au premier clic, mutable)
│   ├── sfx.js              # Sons SFX : splash, explosion, placementSuccess/Fail + mute
│   └── shipSvgs.js         # SVG inline par bateau + constante CELL_SIZE
├── main.js                 # Point d'entrée webpack
└── tests/
    ├── ship.test.js
    ├── gameboard.test.js
    ├── player.test.js
    ├── ai.test.js
    └── gameController.test.js
```

## HTML (dist/index.html)
```
<div id="app" class="app">
  <div id="content-left"></div>     ← grille joueur (setup puis battle)
  <div id="content-right"></div>    ← grille ennemie (battle)
  <div id="welcome-screen">        ← écran d'accueil (masqué après clic Play)
    <p>Battleship</p>
    <input id="name" placeholder="Captain name" maxLength=20>
    <button id="play-button">Play</button>
  </div>
</div>
```

## Bateaux du jeu
| Nom         | Taille |
|-------------|--------|
| Carrier     | 5      |
| Battleship  | 4      |
| Destroyer   | 3      |
| Submarine   | 3      |
| Patrol Boat | 2      |

## Ce qui fonctionne ✅

### Logique métier (factories/)
- **Ship** : création, hit(), isSunk() — testé
- **GameBoard** : placement horizontal/vertical, placement aléatoire, validation voisinage,
  takeHit (retourne `{ result, ship, sunk }`), shipMap (lookup O(1) ship → coord),
  getShipAt(row, col), isGameOver() — testé
- **Player** : hitCoords (Set), alreadyHit() — testé
- **AI** : 3 niveaux de difficulté — testé
  - Easy : tirs aléatoires
  - Medium : après un hit, cible les cases adjacentes
  - Hard : medium + pattern en damier pour la recherche
- **GameController** : orchestration setup → battle → over, playerAttack(),
  computerTurn(), getSunkShipPositions(), resetGame() — testé

### Interface (DOM/)
- **Écran d'accueil** : champ nom + bouton Play
- **Phase setup** : dock de bateaux avec SVGs, drag & drop sur la grille joueur,
  preview vert (placement possible) / rouge (impossible), boutons Rotate / Random / Reset
- **Phase battle** : grille ennemie cliquable, affichage bateaux du joueur,
  couleurs hit (rouge) / miss (gris), overlay bateau coulé révélé sur grille ennemie
- **Score panels** : liste des bateaux des deux flottes, icône ☠ quand coulé
- **Messages** : zone typewriter animée (hit, miss, coulé, victoire, défaite)
- **Animation radar** : faisceau circulaire sur les deux grilles pendant la bataille
- **Game over** : overlay victoire/défaite, sélecteur de difficulté, bouton Play Again
- **Sons** : musique de fond pirates.mp3 (lancée au premier clic), SFX splash/explosion,
  sons de placement success/fail — mute indépendant musique et SFX

## Améliorations futures possibles

- **Responsive mobile** : les grilles ne s'adaptent pas aux petits écrans
- **Déploiement GitHub Pages** : configurer webpack `publicPath` + workflow GitHub Actions
- **Sifflement d'obus** : son de projectile entre le clic et l'impact
- **Animations hit/miss** : explosion CSS ou sprite animé à l'impact
- **Transitions de phase** : fondu enchaîné setup → battle → over

## Conventions de code
- ES6 modules (import/export) partout sauf jest.config.cjs et babel.config.cjs
- Classes (pas de factory functions, pas de singletons)
- Séparer strictement logique (factories/) et DOM (DOM/)
- Les tests ne testent PAS le DOM (consigne Odin)
- Nommage : camelCase variables/fonctions, PascalCase classes
- Grille 10×10, constante SIZE = 10
- Coordonnées : `{ row, col }` — jamais `(x, y)`
- Comparaisons strictes uniquement (=== et !==)
- `hitCoords` est un Set, stocke les clés `"row,col"`

## Commandes
- `npm test` — tests Jest (66 tests)
- `npm run lint` — ESLint (0 warnings attendu)
- `npx webpack` — build production → dist/
- `npx webpack serve` — dev server

## Règles pour Claude Code
- TOUJOURS lire le fichier concerné avant de le modifier
- Lancer `npm test` après chaque modification de factories/ ou tests/
- Lancer `npm run lint` après toute modification de src/modules/
- Ne JAMAIS mettre de logique DOM dans factories/
- Ne JAMAIS casser les tests existants sans raison documentée
- Quand un test doit changer (ex: refactor), expliquer pourquoi
- Proposer des tests pour toute nouvelle logique métier
- Commits atomiques : un changement logique = un commit
