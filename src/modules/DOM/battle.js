import support from './support.js';
import { CELL_SIZE } from '../utils/shipSvgs.js';

let controller = null;
let playerTurnLocked = false;

function init(gameController) {
    controller = gameController;
    loadBattleContent();
}

function loadBattleContent() {
    const contentLeft = document.getElementById('content-left');
    contentLeft.innerHTML = '';

    const leftSection = document.createElement('div');
    leftSection.className = 'battle-section';

    const leftTitle = document.createElement('h2');
    leftTitle.className = 'board-title';
    leftTitle.textContent = 'Your Fleet';
    leftSection.appendChild(leftTitle);

    const playerMap = support.createMap('player');
    leftSection.appendChild(playerMap);

    const messageBar = document.createElement('div');
    messageBar.className = 'message-bar';
    messageBar.id = 'message-bar';
    messageBar.textContent = 'Your turn — fire at the enemy grid!';
    leftSection.appendChild(messageBar);

    contentLeft.appendChild(leftSection);

    renderPlayerShips();

    const contentRight = document.getElementById('content-right');
    contentRight.innerHTML = '';

    const rightSection = document.createElement('div');
    rightSection.className = 'battle-section';

    const rightTitle = document.createElement('h2');
    rightTitle.className = 'board-title';
    rightTitle.textContent = 'Enemy Waters';
    rightSection.appendChild(rightTitle);

    const computerMap = support.createMap('computer');
    rightSection.appendChild(computerMap);

    contentRight.appendChild(rightSection);

    initAttackListeners();
}

function renderPlayerShips() {
    const board = controller.game.playerBoard.board;
    const container = document.getElementById('field-container-player');
    if (!container) return;

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if (board[r][c] !== 'x' && board[r][c] !== 'hit' && board[r][c] !== 'miss') {
                const cell = container.querySelector(`.field[data-row="${r}"][data-col="${c}"]`);
                if (cell) cell.classList.add('ship-placed');
            }
        }
    }
}

function initAttackListeners() {
    const container = document.getElementById('field-container-computer');
    if (!container) return;

    container.addEventListener('click', onCellClick);
}

function onCellClick(e) {
    const cell = e.target.closest('.field');
    if (!cell || playerTurnLocked) return;
    if (controller.phase !== 'battle' || controller.game.currentTurn !== 'player') return;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    const result = controller.playerAttack(row, col);
    if (!result || result.result === 'already') return;

    applyCellResult(cell, result);

    const winner = controller.checkGameOver();
    if (winner) {
        showMessage(winner === 'player' ? 'Victory! You sank the entire enemy fleet!' : 'Defeat! Your fleet has been sunk!');
        showGameOverScreen(winner);
        return;
    }

    if (result.result === 'hit' && result.sunk) {
        showMessage(`You sank their ${result.ship.name}!`);
    } else if (result.result === 'hit') {
        showMessage('Hit!');
    } else {
        showMessage('Miss...');
    }

    playerTurnLocked = true;
    setTimeout(() => {
        doComputerTurn();
        playerTurnLocked = false;
    }, 500);
}

function doComputerTurn() {
    const result = controller.computerTurn();
    if (!result) return;

    const container = document.getElementById('field-container-player');
    if (!container) return;

    const cell = container.querySelector(`.field[data-row="${result.row}"][data-col="${result.col}"]`);
    if (cell) {
        applyCellResult(cell, result);
    }

    const winner = controller.checkGameOver();
    if (winner) {
        showMessage(winner === 'player' ? 'Victory! You sank the entire enemy fleet!' : 'Defeat! Your fleet has been sunk!');
        showGameOverScreen(winner);
        return;
    }

    if (result.result === 'hit' && result.sunk) {
        showMessage(`Enemy sank your ${result.ship.name}! Your turn.`);
    } else if (result.result === 'hit') {
        showMessage('Enemy hit your ship! Your turn.');
    } else {
        showMessage('Enemy missed. Your turn!');
    }
}

function applyCellResult(cell, result) {
    cell.classList.remove('ship-placed');
    if (result.result === 'hit') {
        cell.classList.add('cell-hit');
    } else {
        cell.classList.add('cell-miss');
    }
}

function showMessage(text) {
    const bar = document.getElementById('message-bar');
    if (bar) bar.textContent = text;
}

function showGameOverScreen(winner) {
    playerTurnLocked = true;

    const overlay = document.createElement('div');
    overlay.className = 'gameover-overlay';

    const box = document.createElement('div');
    box.className = 'gameover-box';

    const title = document.createElement('h2');
    title.className = 'gameover-title';
    title.textContent = winner === 'player' ? 'Victory!' : 'Defeat!';

    const subtitle = document.createElement('p');
    subtitle.className = 'gameover-subtitle';
    subtitle.textContent = winner === 'player'
        ? 'You destroyed the entire enemy fleet.'
        : 'Your fleet has been destroyed.';

    const btn = document.createElement('button');
    btn.className = 'setup-btn';
    btn.textContent = 'Play Again';
    btn.addEventListener('click', async () => {
        overlay.remove();
        controller.resetGame();
        playerTurnLocked = false;

        const contentRight = document.getElementById('content-right');
        contentRight.innerHTML = '';

        const setup = await import('./setup.js');
        setup.default.init(controller);
    });

    box.appendChild(title);
    box.appendChild(subtitle);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

export default { init };
