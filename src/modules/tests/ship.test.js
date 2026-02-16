import Ship from '../factories/ship.js'

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

    test('get the name', () =>{
        expect(ship.getName()).toEqual("test_ship")
    })

    test('get the size', () =>{
        expect(ship.getSize()).toEqual(3)
    })

    test('sinks', () => {
        ship.hit()
        ship.hit()
        ship.hit()
        expect(ship.isSunk()).toBe(true)
      })

  });