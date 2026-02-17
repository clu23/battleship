let audioCtx = null;

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function placementSuccess() {
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

function playMp3(importPromise) {
    importPromise.then(module => {
        const audio = new Audio(module.default);
        audio.volume = 0.5;
        audio.play();
    });
}

function attackFire() {
    playMp3(import('../../sounds/canon.mp3'));
}

function attackHit() {
    playMp3(import('../../sounds/explosion.mp3'));
}

function attackMiss() {
    playMp3(import('../../sounds/splash.mp3'));
}

function shipSunk() {
    playMp3(import('../../sounds/sunk.mp3'));
}

export { placementSuccess, placementFail, attackFire, attackHit, attackMiss, shipSunk };
