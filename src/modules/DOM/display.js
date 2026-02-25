import GameController from '../gameController.js';
import setup from './setup.js';

const controller = new GameController();

class Display {
  constructor() {}

  initPlayButton() {
    const button = document.getElementById('play-button');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.onPlay();
    });

    const nameInput = document.getElementById('name');
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.onPlay();
      }
    });
  }

  onPlay() {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.toString().trim();
    if (name) {
      controller.game.setPlayerName(`Captain ${name}`);
    }

    const difficultyInput = document.querySelector(
      'input[name="difficulty"]:checked'
    );
    if (difficultyInput) {
      controller.setDifficulty(difficultyInput.value);
    }

    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.classList.add('hidden');

    setup.init(controller);
  }
}

export default Display;
