
import Ship from './ship.js';

const SIZE = 10;


class GameBoard {
    constructor() {
        this.board = new Array(SIZE).fill('x').map(() => new Array(SIZE).fill('x'));
        this.missedShots = new Array(SIZE).fill(false).map(() => new Array(SIZE).fill(false));
        this.placeMode = "X";
        this.fleet = [];
    }

    rotate() {
        if (this.placeMode === "X") {
            this.placeMode = "Y";
        }
        else {
            this.placeMode = "X";
        }
    }

    placeShip(ship, row, column, placementMode) {
        if (!this.isPlacementPossible(ship, row, column, placementMode)) {
            return false
        }

        if (placementMode === 'Y') {
            for (let i = 0; i < ship.size; i++) {
                this.board[row + i][column] = ship
            }
        }
        else {
            for (let i = 0; i < ship.size; i++) {
                this.board[row][column + i] = ship
            }
        }
        this.fleet.push(ship);
        return true
    }

    placeShipsRandomly() {
        if (this.fleet.length > 0) {
            return
        }

        const ships = []
        const carrier = new Ship(5, "carrier")
        const battleship = new Ship(4, "battleship")
        const destroyer = new Ship(3, "destroyer")
        const submarine = new Ship(3, "submarine")
        const patrolBoat = new Ship(2, "patrolBoat")
        ships.push(carrier, battleship, destroyer, submarine, patrolBoat)

        let succesfulPlacements = 0

        while (succesfulPlacements < 5) {
            const row = Math.floor(Math.random() * 10)
            const column = Math.floor(Math.random() * 10)
            const placementMode = ('XY').split('')[(Math.floor(Math.random() * 2))]

            if (this.placeShip(ships[succesfulPlacements], row, column, placementMode)) {
                succesfulPlacements++
            }
        }
    }

    isPlacementPossible(ship, row, column, placementMode) {
        if (row < 0 || row > SIZE - 1 || column < 0 || column > SIZE - 1) {
            return false
        }

        if (placementMode === "X") {
            if (column + ship.size > SIZE) return false
        }
        else {
            if (row + ship.size > SIZE) return false
        }

        if (placementMode === 'Y') {
            for (let i = 0; i < ship.size; i++) {
              if (this.board[row + i][column] !== 'x') return false
            }
          } else {
            for (let i = 0; i < ship.size; i++) {
              if (this.board[row][column + i] !== 'x') return false
            }
          }

        if (placementMode === 'Y') {
            for (let i = 0; i < ship.size; i++) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                if (
                    row + x + i < 0 ||
                    row + x + i >= SIZE ||
                    column + y < 0 ||
                    column + y >= SIZE
                )
                    continue
                if (this.board[row + x + i][column + y] !== 'x') return false
                }
            }
            }
        } else {
            for (let i = 0; i < ship.size; i++) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                if (
                    row + x < 0 ||
                    row + x >= SIZE ||
                    column + y + i < 0 ||
                    column + y + i >= SIZE
                )
                    continue
                if (this.board[row + x][column + y + i] !== 'x') return false
                }
            }
            }
        }
        return true
    }

    takeHit(row, column) {
        if (row < 0 || row >= SIZE || column < 0 || column >= SIZE) {
            return false
        }

        if (this.board[row][column] !== 'x') {
            this.board[row][column].hit();
            this.board[row][column] = 'o';
            return true
        }
        else {
            this.board[row][column] = 'o';
            this.missedShots[row][column] = true;
            return false
        }
    }

    checkSunk() {
        for (let i = 0; i < this.fleet.length; i++) {
            if (this.fleet[i].sunk === true) {
                return true
            }
        }
        return false
    }

    isGameOver() {
        if (this.fleet.length === 0) {
            return false
        }
        else {
            for (let i = 0; i < this.fleet.length; i++) {
                if (!this.fleet[i].isSunk()) {
                    return false
                }
            }
        }
        return true
    }

    isEmpty() {
        for (let i = 0; i < SIZE; i++) {
          for (let j = 0; j < SIZE; j++) {
            if (this.board[i][j] !== 'x') return false
          }
        }
        return true
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
        return counter
    }
}

export default GameBoard
