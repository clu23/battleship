//import Ship from "../factories/ship.js"
const Ship = require('../factories/ship')

describe("Ship", () => {
    let ship

    beforeEach(() => {
        ship = new Ship(3,'test_ship')
    })

    test('creates and initializes a ship', () => {
        expect(ship).toEqual({ size: 3, hits: 0, name: 'test_ship', sunk: false})
    })

    test('takes a hit', () => {
        ship.hit()
        expect(ship.hits).toEqual(1)
    })

  });