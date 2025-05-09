import Game from '../factories/game.js';




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
            Game.getPlayer().setName(`Captain ${name}`)
        }
        console.log(name)
    }

}

export default Display
