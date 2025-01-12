const GameBoard = require('./gameboard')


class Player{

    constructor(name){
        this.name=name;
        this.hitCoords=[]
    }

    attack(x,y,gameboard){
        if (this.alreadyHit(x,y)){
            return
        }
        this.hitCoords.push([x,y]);
        gameboard.takeHit(x,y);

    }

    randomAttack(gameboard) {
        if (this.hitCoords.length === 100) return
    
        let x = Math.floor(Math.random() * 10)
        let y = Math.floor(Math.random() * 10)
    
        while (this.alreadyHit(x, y)) {
          x = Math.floor(Math.random() * 10)
          y = Math.floor(Math.random() * 10)
        }
    
        this.hitCoords.push([x, y])
        gameboard.takeHit(x, y)
    }

    alreadyHit(x,y) {
        for (let i = 0; i < this.hitCoords.length; i++) {
          if (this.hitCoords[i][0] === x && this.hitCoords[i][1] === y){
            return true
          }
        }
        return false
      }
}


module.exports=Player