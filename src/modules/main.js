import Sound from './utils/sound.js';
import Display from './DOM/display.js';
import { toggleSfxMute, isSfxMuted } from './utils/sfx.js';

const sound = new Sound();
const display = new Display();

sound.BackgroundOnClick();
display.initPlayButton();

function createMuteButton() {
    const btn = document.createElement('button');
    btn.id = 'mute-btn';
    btn.className = 'mute-btn';
    btn.title = 'Toggle music';
    btn.textContent = '\uD83D\uDD0A';
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = sound.toggle();
        btn.textContent = muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
    });
    document.body.appendChild(btn);
}

function createSfxMuteButton() {
    const btn = document.createElement('button');
    btn.id = 'sfx-btn';
    btn.className = 'mute-btn mute-btn--sfx';
    btn.title = 'Toggle sound effects';
    btn.textContent = '\uD83D\uDD14';
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = toggleSfxMute();
        btn.textContent = muted ? '\uD83D\uDD15' : '\uD83D\uDD14';
    });
    document.body.appendChild(btn);
}

createMuteButton();
createSfxMuteButton();
