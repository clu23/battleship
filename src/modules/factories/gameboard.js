
import Ship from './ship.js'

const SIZE = 10

class GameBoard{
    constructor(){
        this.board=new Array(SIZE).fill('x').map(() => new Array(SIZE).fill('x'));
        this.missedShots=new Array(SIZE).fill(false).map(() => new Array(SIZE).fill(false));
        this.placeMode="X";
        this.fleet=[];
    }

    rotate(){
        if (this.placeMode==="X"){
            this.placeMode="Y";
        }
        else{
            this.placeMode="X";
        }
    }

    placeShip(ship,row,column,placementMode){
        if (!this.isPlacementPossible(ship, row, column, placementMode)){
            return false
        }
        
        if(placementMode==='Y'){
            for(let i=0;i<ship.size;i++){
                this.board[row+i][column]=ship
            }
        }
        else{
            for(let i=0;i<ship.size;i++){
                this.board[row][column+i]=ship
            } 
        }
        this.fleet.push(ship);
        return true

    }

    //A function to place ships randomly, for it to work the user must not have place any ship yet
    placeShipsRandomly(){
        if(this.fleet.length>0){
            return
        }

        const ships = []
        const carrier = new Ship(5,"carrier")
        const battleship = new Ship(4,"battleship")
        const destroyer = new Ship(3,"destroyer")
        const submarine = new Ship(3,"submarine")
        const patrolBoat = new Ship(2,"patrolBoat")
        ships.push(carrier, battleship, destroyer, submarine, patrolBoat)

        let succesfulPlacements = 0

        while (succesfulPlacements < 5) {
            const row = Math.floor(Math.random() * 10)
            const column = Math.floor(Math.random() * 10)
            const placementMode = ('XY').split('')[(Math.floor(Math.random() * 2 ))]
      
            if (this.placeShip(ships[succesfulPlacements], row, column, placementMode)){
                succesfulPlacements++
            }
              
          }
    }

    isPlacementPossible(ship,row,column,placementMode){

         // case position is out of gameboard
        if (row<0 || row>SIZE-1 || column<0 || column>SIZE-1){
            return false
        }

        // case ship doesn't fit in gameboard
        if (placementMode==="X"){
            if (column + ship.size > SIZE) return false
        }
        else{
            if (row + ship.size > SIZE) return false
        }

        // case any of the fields is already taken
        if (placementMode==='Y') {
            for (let i = 0; i < ship.size; i++) {
              if (this.board[row + i][column]!='x') return false
            }
          } else {
            for (let i = 0; i < ship.size; i++) {
              if (this.board[row][column + i]!='x') return false
            }
          }

        
        // case any of the neighbour fields are already taken, the user is not allowed to place ships that are in contact with one another (a clear message should be displayed)
        if (placementMode==='Y') {
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
                if (this.board[row + x + i][column + y]!='x') return false
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
                if (this.board[row + x][column + y + i]!='x') return false
                }
            }
            }
        }
        return true
    }
}



