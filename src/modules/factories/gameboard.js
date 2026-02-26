import Ship from './ship.js';

const SIZE = 10;

class GameBoard {
  constructor() {
    this.board = new Array(SIZE).fill('x').map(() => new Array(SIZE).fill('x'));
    this.missedShots = new Array(SIZE)
      .fill(false)
      .map(() => new Array(SIZE).fill(false));
    this.placeMode = 'X';
    this.fleet = [];
    this.placements = [];
  }

  rotate() {
    if (this.placeMode === 'X') {
      this.placeMode = 'Y';
    } else {
      this.placeMode = 'X';
    }
  }

  placeShip(ship, row, col, placementMode) {
    if (!this.isPlacementPossible(ship, row, col, placementMode)) {
      return false;
    }

    const isVertical = placementMode === 'Y';
    for (let i = 0; i < ship.size; i++) {
      const r = isVertical ? row + i : row;
      const c = isVertical ? col : col + i;
      this.board[r][c] = ship;
    }
    this.fleet.push(ship);
    this.placements.push({ ship, row, col, orientation: placementMode });
    return true;
  }

  placeShipsRandomly() {
    if (this.fleet.length > 0) {
      return;
    }

    const ships = [];
    const carrier = new Ship(5, 'Carrier');
    const battleship = new Ship(4, 'Battleship');
    const destroyer = new Ship(3, 'Destroyer');
    const submarine = new Ship(3, 'Submarine');
    const patrolBoat = new Ship(2, 'PatrolBoat');
    ships.push(carrier, battleship, destroyer, submarine, patrolBoat);

    let succesfulPlacements = 0;

    while (succesfulPlacements < 5) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const placementMode = 'XY'.split('')[Math.floor(Math.random() * 2)];

      if (
        this.placeShip(ships[succesfulPlacements], row, col, placementMode)
      ) {
        succesfulPlacements++;
      }
    }
  }

  isPlacementPossible(ship, row, col, placementMode) {
    if (row < 0 || row > SIZE - 1 || col < 0 || col > SIZE - 1) {
      return false;
    }

    const isVertical = placementMode === 'Y';

    if (isVertical ? row + ship.size > SIZE : col + ship.size > SIZE) {
      return false;
    }

    for (let i = 0; i < ship.size; i++) {
      const r = isVertical ? row + i : row;
      const c = isVertical ? col : col + i;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (r + dr < 0 || r + dr >= SIZE || c + dc < 0 || c + dc >= SIZE)
            continue;
          if (this.board[r + dr][c + dc] !== 'x') return false;
        }
      }
    }
    return true;
  }

  takeHit(row, col) {
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      return { result: 'miss' };
    }

    const cell = this.board[row][col];

    if (cell === 'hit' || cell === 'miss') {
      return { result: 'already' };
    }

    if (cell !== 'x') {
      cell.hit();
      this.board[row][col] = 'hit';
      return { result: 'hit', ship: cell, sunk: cell.isSunk() };
    }

    this.board[row][col] = 'miss';
    this.missedShots[row][col] = true;
    return { result: 'miss' };
  }

  checkSunk() {
    for (let i = 0; i < this.fleet.length; i++) {
      if (this.fleet[i].sunk === true) {
        return true;
      }
    }
    return false;
  }

  isGameOver() {
    if (this.fleet.length === 0) {
      return false;
    } else {
      for (let i = 0; i < this.fleet.length; i++) {
        if (!this.fleet[i].isSunk()) {
          return false;
        }
      }
    }
    return true;
  }

  isEmpty() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j] !== 'x') return false;
      }
    }
    return true;
  }

  getFreeCells() {
    let counter = 100;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.board[i][j] !== 'x') {
          counter = counter - 1;
        }
      }
    }
    return counter;
  }
}

export default GameBoard;
