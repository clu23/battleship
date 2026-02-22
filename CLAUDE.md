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
- Jest 29 (tests unitaires) avec Babel pour la conversion ESM → CJS
- Vanilla JS (ES6 modules, pas de framework)
- CSS custom (pas de Tailwind/Bootstrap)
- Police : Big Shoulders Stencil Text (Google Fonts, déjà dans index.html)

## Architecture

```
src/modules/
├── factories/          # Logique métier pure (ZÉRO DOM ici)
│   ├── ship.js         # Classe Ship : size, name, hits, sunk, hit(), isSunk()
│   ├── gameboard.js    # Classe GameBoard : grille 10x10, placement, takeHit, isGameOver
│   ├── player.js       # Classe Player : attack(), randomAttack(), alreadyHit()
│   └── game.js         # Classe Game : instancie players + boards, gère les tours
├── DOM/                # Tout ce qui touche au DOM
│   ├── display.js      # Écran d'accueil, bouton play, setPlayerName
│   ├── setup.js        # Phase placement bateaux (à compléter)
│   └── support.js      # Helpers : createMap(), createBoard(), create(), coords utils
├── utils/
│   ├── sound.js        # Musique de fond pirates.mp3 (lancée au premier clic)
│   └── messages.js     # Messages in-game (à corriger, retourne undefined)
├── main.js             # Point d'entrée webpack
└── tests/
    ├── ship.test.js
    ├── gameboard.test.js
    └── player.test.js
```

## HTML existant (dist/index.html)
```
<div id="app" class="app">
  <div id="content-left"></div>     ← prévu pour la grille joueur
  <div id="content-right"></div>    ← prévu pour la grille ennemie
  <div id="welcome-screen">        ← écran d'accueil (visible au démarrage)
    <p>Battleship</p>
    <input id="name" placeholder="Captain name" maxLength=20>
    <button id="play-button">Play</button>
  </div>
</div>
```
Le welcome-screen doit être masqué après clic sur Play.
content-left et content-right accueillent les grilles via support.js createMap().

## Bateaux du jeu
| Nom         | Taille |
|-------------|--------|
| Carrier     | 5      |
| Battleship  | 4      |
| Destroyer   | 3      |
| Submarine   | 3      |
| Patrol Boat | 2      |

## Ce qui fonctionne ✅
- Ship : création, hit(), isSunk() — testé
- GameBoard : placement (X/Y), placement aléatoire, validation voisinage, takeHit, isGameOver — testé
- Player : attack(), randomAttack(), alreadyHit() — testé
- support.js : createMap(), createBoard(), createLettersSection(), createNumbersSection()
- Écran d'accueil avec champ nom + bouton Play
- Son de fond (pirates.mp3)

## Bugs critiques — CORRIGER EN PREMIER (dans cet ordre)

### P0 — Bloquants
1. **Singletons GameBoard et Game** : gameboard.js exporte `new _GameBoard()` au lieu de la classe. Il faut DEUX plateaux (joueur + ordi). Pareil pour game.js. → Exporter les classes, pas des instances. Game doit contenir playerBoard + computerBoard.
2. **ESM vs CommonJS** : package.json a `"type": "module"` mais les tests utilisent `require()` et jest.config.js utilise `module.exports`. → Installer Babel (@babel/core, @babel/preset-env, babel-jest), créer babel.config.cjs, renommer jest.config.cjs, convertir les tests en import.
3. **takeHit() perd la référence ship** : la cellule passe de `ship` à `'o'` après un hit. On ne sait plus quel bateau a été touché. → Utiliser 'hit'/'miss' comme marqueurs et retourner { result, ship, sunk }.

### P1 — À corriger ensuite
4. **messages.js** : l'IIFE ne retourne rien → Message === undefined.
5. **setup.js** : utilise `Component` et `Message` qui n'existent pas / ne sont pas importés.
6. **game.js** : `setPlayerName()` appelle `getPlayer()` au lieu de `this.getPlayer()`.
7. **Comparaisons non strictes** : utiliser === et !== partout (pas == et !=).

## Features manquantes — À implémenter APRÈS les bugs

### Phase 1 — Game controller
- [ ] gameController.js : orchestration setup → battle → over
- [ ] Méthodes : startGame(), playerAttack(row, col), computerTurn(), resetGame()
- [ ] Le controller ne touche PAS au DOM, il retourne des données

### Phase 2 — Rendu DOM
- [ ] Afficher les 2 grilles (support.js createMap existe déjà)
- [ ] data-row et data-col sur chaque cellule
- [ ] Couleurs : bleu=eau, rouge=hit, gris=miss, noir=coulé
- [ ] Afficher les bateaux du joueur sur sa propre grille
- [ ] Event listeners sur la grille ennemie pour attaquer
- [ ] Messages : "Hit !", "Destroyer coulé !", "Victoire/Défaite"

### Phase 3 — Placement interactif
- [ ] Liste des bateaux à placer
- [ ] Clic sur grille joueur pour placer
- [ ] Bouton rotation (X/Y)
- [ ] Bouton Random + bouton Reset
- [ ] Feedback visuel (vert=possible, rouge=impossible)

### Phase 4 — Polish
- [ ] Remplacer les sons de splash/explosion par de meilleurs fichiers MP3
- [ ] IA avec 3 niveaux de difficulté :
  - Easy : tirs aléatoires (actuel)
  - Medium : après un hit, l'IA cible les cases adjacentes
  - Hard : medium + l'IA privilégie un pattern en damier pour chercher les bateaux
- [ ] Animation radar : faisceau circulaire semi-transparent qui balaie les grilles en continu
- [ ] Score panel : liste des bateaux coulés (joueur et ennemi) affichée à côté de chaque grille, avec le nom et une icône barrée quand coulé
- [ ] CSS complet et responsive
- [ ] Animations hits/miss
- [ ] Transition entre les phases (setup → battle → over)

## Conventions de code
- ES6 modules (import/export) partout sauf jest.config.cjs et babel.config.cjs
- Classes (pas de factory functions, pas de singletons)
- Séparer strictement logique (factories/) et DOM (DOM/)
- Les tests ne testent PAS le DOM (consigne Odin)
- Nommage : camelCase variables/fonctions, PascalCase classes
- Grille 10×10, constante SIZE = 10
- Coordonnées : (row, column)
- Comparaisons strictes uniquement (=== et !==)

## Commandes
- `npm test` — tests Jest
- `npx webpack` — build production → dist/
- `npx webpack serve` — dev server

## Règles pour Claude Code
- TOUJOURS lire le fichier concerné avant de le modifier
- Lancer `npm test` après chaque modification de factories/ ou tests/
- Ne JAMAIS mettre de logique DOM dans factories/
- Ne JAMAIS casser les tests existants sans raison documentée
- Quand un test doit changer (ex: refactor takeHit), expliquer pourquoi
- Proposer des tests pour toute nouvelle logique
- Commits atomiques : un changement logique = un commit
- Quand un bug P0/P1 est corrigé, mettre à jour ce fichier
