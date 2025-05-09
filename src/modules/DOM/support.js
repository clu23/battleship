const support = (() => {
    //DOM

    function deleteAppContent() {
        const app = document.getElementById('app')
        app.replaceChildren('')
    }

    function getHeader(className) {
        const header = document.createElement('header')
        header.classList.add('header', `${className}`)
    
        const title = document.createElement('h1')
        title.textContent = 'Battleship'
    
        header.appendChild(title)
    
        return header
    }

    const BOARD_SIZE = 10

    function createMap(description) {
        const map = document.createElement('div')
        map.id = `board-${description}`
        map.classList.add('board', description)
    
        map.appendChild(createLettersSection())
        map.appendChild(createNumbersSection())
        map.appendChild(createBoard(description))
    
        return map
    }
    

})()


export default support


