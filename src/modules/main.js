import Sound from './utils/sound.js';
import Display from './DOM/display.js';

const sound = new Sound();
const display = new Display();

sound.BackgroundOnClick();
display.initPlayButton();

function createMuteButton() {
    const btn = document.createElement('button');
    btn.id = 'mute-btn';
    btn.className = 'mute-btn';
    btn.textContent = '\uD83D\uDD0A';
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = sound.toggle();
        btn.textContent = muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
    });
    document.body.appendChild(btn);
}

createMuteButton();
