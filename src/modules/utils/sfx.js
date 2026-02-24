let audioCtx = null;
let _sfxMuted = false;

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export function isSfxMuted() {
    return _sfxMuted;
}

export function toggleSfxMute() {
    _sfxMuted = !_sfxMuted;
    return _sfxMuted;
}

function placementSuccess() {
    if (_sfxMuted) return;

    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
}

function placementFail() {
    if (_sfxMuted) return;

    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
}

function playMp3WithRate(importPromise, rate) {
    if (_sfxMuted) return;

    importPromise.then(module => {
        const audio = new Audio(module.default);
        audio.volume = 0.5;
        audio.playbackRate = rate;
        audio.play();
    });
}

function playAttackSequence(result) {
    // 1. Canon fire immediately
    playMp3WithRate(import('../../sounds/canon.mp3'), 0.9);

    // 2. Result sound after 500ms
    return new Promise(resolve => {
        setTimeout(() => {
            if (result.result === 'hit' && result.sunk) {
                playMp3WithRate(import('../../sounds/explosion.mp3'), 0.7);
                setTimeout(() => {
                    playMp3WithRate(import('../../sounds/sunk.mp3'), 0.6);
                    setTimeout(resolve, 400);
                }, 300);
            } else if (result.result === 'hit') {
                playMp3WithRate(import('../../sounds/explosion.mp3'), 0.7);
                setTimeout(resolve, 400);
            } else {
                playMp3WithRate(import('../../sounds/splash.mp3'), 1.1);
                setTimeout(resolve, 300);
            }
        }, 500);
    });
}

export { placementSuccess, placementFail, playAttackSequence };
