import Game from './factories/game.js';
import Ship from './factories/ship.js';
import AI from './factories/ai.js';

const SHIPS_TO_PLACE = [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Destroyer', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'PatrolBoat', size: 2 },
];

class GameController {
    constructor() {
        this.game = new Game();
        this.phase = 'setup';
        this.orientation = 'X';
        this.placedShipsCount = 0;
        this.difficulty = 'medium';
        this.ai = new AI(this.difficulty);
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.ai = new AI(level);
    }

    getShipsToPlace() {
        return SHIPS_TO_PLACE.map(s => ({ ...s }));
    }

    getCurrentShipToPlace() {
        if (this.placedShipsCount >= SHIPS_TO_PLACE.length) return null;
        return { ...SHIPS_TO_PLACE[this.placedShipsCount] };
    }

    rotateOrientation() {
        this.orientation = this.orientation === 'X' ? 'Y' : 'X';
        return this.orientation;
    }

    placePlayerShip(ship, row, col, orientation) {
        if (this.phase !== 'setup') return false;
        const shipObj = new Ship(ship.size, ship.name);
        const placed = this.game.playerBoard.placeShip(shipObj, row, col, orientation);
        if (placed) {
            this.placedShipsCount++;
        }
        return placed;
    }

    placeComputerShips() {
        this.game.computerBoard.placeShipsRandomly();
    }

    startBattle() {
        if (this.placedShipsCount < SHIPS_TO_PLACE.length) return false;
        this.placeComputerShips();
        this.phase = 'battle';
        this.game.gamePhase = 'battle';
        this.game.currentTurn = 'player';
        return true;
    }

    resetPlacement() {
        this.game.playerBoard = new (this.game.playerBoard.constructor)();
        this.placedShipsCount = 0;
        this.orientation = 'X';
    }

    playerAttack(row, col) {
        if (this.phase !== 'battle' || this.game.currentTurn !== 'player') return null;
        if (this.game.player.alreadyHit(row, col)) return { result: 'already' };

        this.game.player.hitCoords.push([row, col]);
        const result = this.game.computerBoard.takeHit(row, col);
        this.game.switchTurn();
        return result;
    }

    computerTurn() {
        if (this.phase !== 'battle' || this.game.currentTurn !== 'computer') return null;

        const { row, col } = this.ai.getNextMove();
        this.game.computer.hitCoords.push([row, col]);
        const result = this.game.playerBoard.takeHit(row, col);
        this.ai.recordResult(row, col, result);
        this.game.switchTurn();
        return { row, col, ...result };
    }

    getSunkShipPositions(board) {
        return board.placements
            .filter(p => p.ship.isSunk())
            .map(p => ({
                name: p.ship.name,
                size: p.ship.size,
                row: p.row,
                col: p.column,
                orientation: p.orientation,
            }));
    }

    checkGameOver() {
        if (this.game.computerBoard.isGameOver()) return 'player';
        if (this.game.playerBoard.isGameOver()) return 'computer';
        return null;
    }

    resetGame() {
        this.game.reset();
        this.phase = 'setup';
        this.orientation = 'X';
        this.placedShipsCount = 0;
        this.ai.reset();
    }
}

export default GameController;
