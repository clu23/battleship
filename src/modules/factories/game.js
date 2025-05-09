import Player from './player.js';




class _Game{
    constructor(){
        this.player = new Player('Captain');
        this.computer = new Player('computer');
    }


    getPlayer(){
        return(this.player)
    }

    getComputer(){
        return(this.computer)
    }

    setPlayerName(name = 'Captain') {
        getPlayer().setName(name)
    }
    
}

const Game=new _Game();

export default Game