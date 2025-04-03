const Sound = require('./utils/sound')
const Display = require ('./DOM/display')



const sound = new Sound();
const display = new Display();

sound.BackgroundOnClick();
display.initPlayButton();
