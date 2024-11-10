
import Ship from './ship.js'



class GameBoard{
    constructor(){
        this.board=new Array(10).fill('x').map(() => new Array(10).fill('x'));
        this.placeMode="X";
    }

    rotate(){
        if (this.placeMode==="X"){
            this.placeMode="Y";
        }
        else{
            this.placeMode="X";
        }
    }

    placeShip(x,y){

    }
}