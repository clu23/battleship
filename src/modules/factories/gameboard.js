
import Ship from './ship.js'

const SIZE = 10

class GameBoard{
    constructor(){
        this.board=new Array(SIZE).fill('x').map(() => new Array(SIZE).fill('x'));
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

    placeShip(ship,row,column){

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

    }
}