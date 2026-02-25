import Player from './player.js';
import GameBoard from './gameboard.js';

class Game {
  constructor() {
    this.player = new Player('Captain');
    this.computer = new Player('computer');
    this.playerBoard = new GameBoard();
    this.computerBoard = new GameBoard();
    this.currentTurn = 'player';
    this.gamePhase = 'setup';
  }

  getPlayer() {
    return this.player;
  }

  getComputer() {
    return this.computer;
  }

  setPlayerName(name = 'Captain') {
    this.getPlayer().setName(name);
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === 'player' ? 'computer' : 'player';
  }

  reset() {
    this.player = new Player('Captain');
    this.computer = new Player('computer');
    this.playerBoard = new GameBoard();
    this.computerBoard = new GameBoard();
    this.currentTurn = 'player';
    this.gamePhase = 'setup';
  }
}

export default Game;
