class Sound {
  constructor() {
    this.audio = null;
    this.muted = false;
  }

  async background() {
    const audioModule = await import('../../sounds/pirates.mp3');
    this.audio = new Audio(audioModule.default);
    this.audio.loop = true;
    this.audio.play();
  }

  BackgroundOnClick() {
    document.addEventListener('click', () => this.background(), { once: true });
  }

  toggle() {
    if (!this.audio) return;
    this.muted = !this.muted;
    this.audio.muted = this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export default Sound;
