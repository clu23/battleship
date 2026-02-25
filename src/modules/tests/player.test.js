import GameBoard from '../factories/gameboard.js'
import Ship from '../factories/ship.js'
import Player from '../factories/player.js'

describe('Player', () => {
    let player;
    let gameboard;
    let ship;
  
    beforeEach(() => {
      player = new Player('Player1');
      gameboard = new GameBoard();
      ship = new Ship(3,'test_ship');
    })
  
    test('create and initialize an object', () => {
      expect(player).toEqual({ name: 'Player1', hitCoords: [] })
    })

    test('attack', () => {
        gameboard.placeShip(ship,1,1,'X')
        player.attack(1, 1, gameboard)
        player.attack(1, 2, gameboard)
        player.attack(1, 3, gameboard)
        expect(ship.hits).toBe(3)
        expect(ship.isSunk()).toBe(true)
        expect(gameboard.isGameOver()).toBe(true)
    
    })

    test('random attack', () => {
        gameboard.placeShip(ship,1,1,'X')
        for (let i = 0; i < 100; i++) {
          player.randomAttack(gameboard)
        }
        expect(gameboard.isGameOver()).toBe(true)
    })

    test('already hit place', () => {
        gameboard.placeShip(ship,1,1,'X')
        player.attack(1,5, gameboard)
        expect(player.alreadyHit(1,5)).toBe(true)
    })
  
    
    })
