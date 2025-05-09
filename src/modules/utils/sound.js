

class Sound{
    constructor(){
    }


    async background() {
        const audioModule = await import('../../sounds/pirates.mp3')
        const audio = new Audio(audioModule.default)
        audio.loop = true
        audio.play()
      }

    BackgroundOnClick() {
         {
          document.addEventListener('click', this.background, { once: true })
        }
      }
}


export default Sound


/*
let test = new Sound();

test.background()
*/