class Player {
  constructor(name) {
    this.name = name;
    this.hitCoords = new Set();
  }

  setName(newName) {
    this.name = newName;
  }

  attack(row, col, gameboard) {
    if (this.alreadyHit(row, col)) {
      return;
    }
    this.hitCoords.add(`${row},${col}`);
    gameboard.takeHit(row, col);
  }

  randomAttack(gameboard) {
    if (this.hitCoords.size === 100) return;

    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);

    while (this.alreadyHit(row, col)) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }

    this.hitCoords.add(`${row},${col}`);
    gameboard.takeHit(row, col);
  }

  alreadyHit(row, col) {
    return this.hitCoords.has(`${row},${col}`);
  }
}

export default Player;
