const Player = require('./player')




class Game{
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



module.exports=Game