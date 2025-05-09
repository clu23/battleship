import support from './support.js'
import Game from '../factories/game.js'


const setup = (() => {

    function loadSetupContent() {
        const app = document.getElementById('app')
        app.classList.add('setup')
    
        app.appendChild(createSetupWrapper())
    
        displayWelcomeMessage()
        initButtons()
    }

    function displayWelcomeMessage() {
        const message = document.getElementById('message-agent')
    
        Component.addTypeWriterMessage(message, Message.getWelcomeMessage())
    }


})()


export default setup