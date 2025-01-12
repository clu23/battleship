const GameBoard = require('../factories/gameboard')
const Ship = require('../factories/ship')

const SIZE=10;

describe("Gameboard", () => {
    let gameboard;
    let ship;
    let testBoard;
    let testMissedShots;

    beforeEach(() => {
        gameboard = new GameBoard();
        ship =  new Ship(3,'test_ship');
        testBoard=[];
        testMissedShots = [];

        for (let i = 0; i < SIZE; i++) {
            testBoard[i] = []
            testMissedShots[i] = []
            for (let j = 0; j < SIZE; j++) {
              testBoard[i][j] = 'x'
              testMissedShots[i][j] = false
            }
        }
    })

    test('create and initialize a gameboard', () => {
        expect(gameboard).toEqual({ board: testBoard, 
                                    missedShots: testMissedShots, 
                                    placeMode: 'X', 
                                    fleet: []})
    })

    test('place a ship', () => {
        gameboard.placeShip(ship, 1, 1, 'X')
        testBoard[1][1] = ship
        testBoard[1][2] = ship
        testBoard[1][3] = ship
        expect(gameboard).toEqual({
            board: testBoard,
            missedShots: testMissedShots, 
            placeMode: 'X', 
            fleet: [ship]})
    })

    test('change placement mode', () => {
        gameboard.rotate()
        expect(gameboard).toEqual({
            board: testBoard,
            missedShots: testMissedShots, 
            placeMode: 'Y', 
            fleet: []})
    })

    test('place 5 ships randomly', () => {
        gameboard.placeShipsRandomly()
        expect(gameboard.getFreeCells()).toBe(83)
    })

    test('prevent ship placement outside gameboard', () => {
        expect(gameboard.isPlacementPossible(ship, 8, 8, 'X')).toBe(false)
        expect(gameboard.isPlacementPossible(ship, 10, 10, 'X')).toBe(false)
    })

    test('prevent ship placement on taken fields', () => {
        gameboard.placeShip(ship,1,1,'X')
        expect(gameboard.isPlacementPossible(ship, 1, 2, 'X')).toBe(false)
        expect(gameboard.isPlacementPossible(ship, 1, 3, 'Y')).toBe(false)
    })

  });

