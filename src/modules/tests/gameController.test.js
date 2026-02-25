import GameController from '../gameController.js';

describe('GameController', () => {
    let gc;

    beforeEach(() => {
        gc = new GameController();
    });

    describe('setup phase', () => {
        test('starts in setup phase', () => {
            expect(gc.phase).toBe('setup');
            expect(gc.orientation).toBe('X');
        });

        test('getShipsToPlace returns 5 ships', () => {
            const ships = gc.getShipsToPlace();
            expect(ships).toHaveLength(5);
            expect(ships[0]).toEqual({ name: 'Carrier', size: 5 });
            expect(ships[4]).toEqual({ name: 'PatrolBoat', size: 2 });
        });

        test('getCurrentShipToPlace returns the next ship', () => {
            expect(gc.getCurrentShipToPlace()).toEqual({ name: 'Carrier', size: 5 });
        });

        test('getCurrentShipToPlace returns null when all placed', () => {
            const ships = gc.getShipsToPlace();
            gc.placePlayerShip(ships[0], 0, 0, 'X');
            gc.placePlayerShip(ships[1], 2, 0, 'X');
            gc.placePlayerShip(ships[2], 4, 0, 'X');
            gc.placePlayerShip(ships[3], 6, 0, 'X');
            gc.placePlayerShip(ships[4], 8, 0, 'X');
            expect(gc.getCurrentShipToPlace()).toBeNull();
        });

        test('rotateOrientation toggles X/Y', () => {
            expect(gc.rotateOrientation()).toBe('Y');
            expect(gc.rotateOrientation()).toBe('X');
        });

        test('placePlayerShip places a ship and returns true', () => {
            const ship = gc.getCurrentShipToPlace();
            expect(gc.placePlayerShip(ship, 0, 0, 'X')).toBe(true);
            expect(gc.placedShipsCount).toBe(1);
        });

        test('placePlayerShip returns false for invalid placement', () => {
            const ship = { name: 'Carrier', size: 5 };
            expect(gc.placePlayerShip(ship, 0, 8, 'X')).toBe(false);
            expect(gc.placedShipsCount).toBe(0);
        });

        test('placePlayerShip returns false when not in setup phase', () => {
            gc.phase = 'battle';
            const ship = { name: 'Carrier', size: 5 };
            expect(gc.placePlayerShip(ship, 0, 0, 'X')).toBe(false);
        });

        test('resetPlacement clears the board and count', () => {
            const ship = gc.getCurrentShipToPlace();
            gc.placePlayerShip(ship, 0, 0, 'X');
            gc.resetPlacement();
            expect(gc.placedShipsCount).toBe(0);
            expect(gc.orientation).toBe('X');
            expect(gc.game.playerBoard.isEmpty()).toBe(true);
        });

        test('startBattle fails if not all ships placed', () => {
            expect(gc.startBattle()).toBe(false);
            expect(gc.phase).toBe('setup');
        });

        test('startBattle succeeds when all ships placed', () => {
            const ships = gc.getShipsToPlace();
            gc.placePlayerShip(ships[0], 0, 0, 'X');
            gc.placePlayerShip(ships[1], 2, 0, 'X');
            gc.placePlayerShip(ships[2], 4, 0, 'X');
            gc.placePlayerShip(ships[3], 6, 0, 'X');
            gc.placePlayerShip(ships[4], 8, 0, 'X');

            expect(gc.startBattle()).toBe(true);
            expect(gc.phase).toBe('battle');
            expect(gc.game.computerBoard.fleet).toHaveLength(5);
        });
    });

    describe('battle phase', () => {
        let gc;

        beforeEach(() => {
            gc = new GameController();
            const ships = gc.getShipsToPlace();
            gc.placePlayerShip(ships[0], 0, 0, 'X');
            gc.placePlayerShip(ships[1], 2, 0, 'X');
            gc.placePlayerShip(ships[2], 4, 0, 'X');
            gc.placePlayerShip(ships[3], 6, 0, 'X');
            gc.placePlayerShip(ships[4], 8, 0, 'X');
            gc.startBattle();
        });

        test('playerAttack returns null if not player turn', () => {
            gc.game.currentTurn = 'computer';
            expect(gc.playerAttack(0, 0)).toBeNull();
        });

        test('playerAttack returns result and switches turn', () => {
            const result = gc.playerAttack(0, 0);
            expect(result).toBeDefined();
            expect(result.result).toMatch(/hit|miss/);
            expect(gc.game.currentTurn).toBe('computer');
        });

        test('playerAttack returns already for repeated coords', () => {
            gc.playerAttack(0, 0);
            gc.game.currentTurn = 'player';
            const result = gc.playerAttack(0, 0);
            expect(result).toEqual({ result: 'already' });
        });

        test('computerTurn returns null if not computer turn', () => {
            expect(gc.computerTurn()).toBeNull();
        });

        test('computerTurn attacks and switches turn', () => {
            gc.game.currentTurn = 'computer';
            const result = gc.computerTurn();
            expect(result).toBeDefined();
            expect(result.row).toBeGreaterThanOrEqual(0);
            expect(result.col).toBeGreaterThanOrEqual(0);
            expect(result.result).toMatch(/hit|miss/);
            expect(gc.game.currentTurn).toBe('player');
        });

        test('checkGameOver returns null during game', () => {
            expect(gc.checkGameOver()).toBeNull();
        });

        test('checkGameOver returns player when computer board sunk', () => {
            const board = gc.game.computerBoard;
            board.fleet.forEach(ship => {
                for (let i = 0; i < ship.size; i++) {
                    ship.hit();
                }
            });
            expect(gc.checkGameOver()).toBe('player');
        });

        test('checkGameOver returns computer when player board sunk', () => {
            const board = gc.game.playerBoard;
            board.fleet.forEach(ship => {
                for (let i = 0; i < ship.size; i++) {
                    ship.hit();
                }
            });
            expect(gc.checkGameOver()).toBe('computer');
        });

        test('getSunkShipPositions returns sunk ships with positions', () => {
            const board = gc.game.playerBoard;
            expect(gc.getSunkShipPositions(board)).toHaveLength(0);

            // Sink the first ship (Carrier at row 0, col 0, orientation X)
            const carrier = board.fleet[0];
            for (let i = 0; i < carrier.size; i++) {
                carrier.hit();
            }

            const sunk = gc.getSunkShipPositions(board);
            expect(sunk).toHaveLength(1);
            expect(sunk[0]).toEqual({
                name: 'Carrier',
                size: 5,
                row: 0,
                col: 0,
                orientation: 'X',
            });
        });

        test('getSunkShipPositions returns empty when no ships sunk', () => {
            expect(gc.getSunkShipPositions(gc.game.computerBoard)).toHaveLength(0);
        });
    });

    describe('resetGame', () => {
        test('resets everything to initial state', () => {
            const ships = gc.getShipsToPlace();
            gc.placePlayerShip(ships[0], 0, 0, 'X');
            gc.placePlayerShip(ships[1], 2, 0, 'X');
            gc.placePlayerShip(ships[2], 4, 0, 'X');
            gc.placePlayerShip(ships[3], 6, 0, 'X');
            gc.placePlayerShip(ships[4], 8, 0, 'X');
            gc.startBattle();

            gc.resetGame();

            expect(gc.phase).toBe('setup');
            expect(gc.orientation).toBe('X');
            expect(gc.placedShipsCount).toBe(0);
            expect(gc.game.playerBoard.isEmpty()).toBe(true);
            expect(gc.game.computerBoard.isEmpty()).toBe(true);
            expect(gc.game.currentTurn).toBe('player');
        });
    });
});
