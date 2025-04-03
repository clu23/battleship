const Game = require('../factories/game')

const game =new Game();


class Display{
    constructor(){
    }


    initPlayButton() {
        const button = document.getElementById('play-button')
        button.addEventListener('click', this.setPlayerName)
      }

    setPlayerName() {
        const name = document.getElementById('name').value.toString().trim()
        if (name) {
            game.getPlayer().setName(`Captain ${name}`)
        }
        console.log(name)
        console.log(game.getPlayer())
    }

}


module.exports=Display