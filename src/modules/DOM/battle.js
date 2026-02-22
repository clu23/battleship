import support from './support.js';
import { getSvg, CELL_SIZE } from '../utils/shipSvgs.js';
import { attackFire, attackHit, attackMiss, shipSunk } from '../utils/sfx.js';
import { createPanel, updatePlayerPanel, updateEnemyPanel } from './scorePanel.js';

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
    leftSection.appendChild(createPanel('Your Fleet'));

    showMessage('Your turn \u2014 fire at the enemy grid!');

    contentLeft.appendChild(leftSection);

    renderPlayerShipOverlays();
    addRadarOverlay('field-container-player');

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
    rightSection.appendChild(createPanel('Enemy Fleet'));

    contentRight.appendChild(rightSection);

    addRadarOverlay('field-container-computer');
    initAttackListeners();
}

function renderPlayerShipOverlays() {
    const container = document.getElementById('field-container-player');
    if (!container) return;

    const placements = controller.game.playerBoard.placements;
    placements.forEach(p => {
        renderShipOverlay(container, p.ship.name, p.ship.size, p.row, p.column, p.orientation);
    });
}

function renderShipOverlay(container, name, size, row, col, orientation) {
    const overlay = document.createElement('div');
    overlay.className = 'ship-overlay battle-ship-overlay';
    overlay.dataset.shipName = name;

    const widthCells = orientation === 'X' ? size : 1;
    const heightCells = orientation === 'Y' ? size : 1;

    overlay.style.left = `${col * CELL_SIZE}px`;
    overlay.style.top = `${row * CELL_SIZE}px`;
    overlay.style.width = `${widthCells * CELL_SIZE}px`;
    overlay.style.height = `${heightCells * CELL_SIZE}px`;

    const svgWrap = document.createElement('div');
    svgWrap.className = 'ship-overlay-svg';
    if (orientation === 'Y') {
        svgWrap.classList.add('rotated');
        svgWrap.style.width = `${size * CELL_SIZE}px`;
        svgWrap.style.height = `${CELL_SIZE}px`;
    }
    svgWrap.innerHTML = getSvg(name, size, orientation);
    overlay.appendChild(svgWrap);

    container.appendChild(overlay);
}

function renderSunkEnemyShip(shipData) {
    const container = document.getElementById('field-container-computer');
    if (!container) return;

    // Only render if not already rendered
    if (container.querySelector(`.ship-overlay[data-ship-name="${shipData.name}"]`)) return;

    renderShipOverlay(container, shipData.name, shipData.size, shipData.row, shipData.col, shipData.orientation);
}

function addRadarOverlay(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const radar = document.createElement('div');
    radar.className = 'radar-sweep';
    container.appendChild(radar);
}

function stopRadar() {
    document.querySelectorAll('.radar-sweep').forEach(el => {
        el.classList.add('radar-stopped');
    });
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

    if (controller.game.player.alreadyHit(row, col)) return;

    attackFire();

    const result = controller.playerAttack(row, col);
    if (!result || result.result === 'already') return;

    setTimeout(() => {
        applyCellResult(cell, result);
        playResultSound(result);
        updateEnemyPanel(result);

        if (result.result === 'hit' && result.sunk) {
            const sunkPositions = controller.getSunkShipPositions(controller.game.computerBoard);
            const sunkShip = sunkPositions.find(s => s.name === result.ship.name);
            if (sunkShip) renderSunkEnemyShip(sunkShip);
        }

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
    }, 150);
}

function doComputerTurn() {
    attackFire();

    setTimeout(() => {
        const result = controller.computerTurn();
        if (!result) {
            playerTurnLocked = false;
            return;
        }

        const container = document.getElementById('field-container-player');
        if (!container) return;

        const cell = container.querySelector(`.field[data-row="${result.row}"][data-col="${result.col}"]`);
        if (cell) {
            applyCellResult(cell, result);
        }

        playResultSound(result);
        updatePlayerPanel(controller.game.playerBoard);

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
    }, 150);
}

function playResultSound(result) {
    if (result.result === 'hit' && result.sunk) {
        shipSunk();
    } else if (result.result === 'hit') {
        attackHit();
    } else {
        attackMiss();
    }
}

function applyCellResult(cell, result) {
    if (result.result === 'hit') {
        cell.classList.add('cell-hit');
    } else {
        cell.classList.add('cell-miss');
    }
}

let typewriterTimer = null;
let typewriterFadeTimer = null;
let typewriterEl = null;

function ensureTypewriterZone() {
    let zone = document.querySelector('.typewriter-zone');
    if (!zone) {
        zone = document.createElement('div');
        zone.className = 'typewriter-zone';
        document.body.appendChild(zone);
    }
    return zone;
}

function showMessage(text) {
    // Clear any running typewriter
    if (typewriterTimer) clearInterval(typewriterTimer);
    if (typewriterFadeTimer) clearTimeout(typewriterFadeTimer);

    const zone = ensureTypewriterZone();

    // Remove old message immediately
    if (typewriterEl) typewriterEl.remove();

    const msg = document.createElement('div');
    msg.className = 'typewriter-msg';
    msg.textContent = '';
    zone.appendChild(msg);
    typewriterEl = msg;

    let i = 0;
    typewriterTimer = setInterval(() => {
        msg.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(typewriterTimer);
            typewriterTimer = null;

            // Stay 2 seconds then fade out
            typewriterFadeTimer = setTimeout(() => {
                msg.classList.add('fadeout');
                typewriterFadeTimer = setTimeout(() => {
                    msg.remove();
                    if (typewriterEl === msg) typewriterEl = null;
                }, 600);
            }, 2000);
        }
    }, 40);
}

function showGameOverScreen(winner) {
    playerTurnLocked = true;
    stopRadar();

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
