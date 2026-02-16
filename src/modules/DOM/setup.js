import support from './support.js';
import { getSvg, CELL_SIZE } from '../utils/shipSvgs.js';
import { placementSuccess, placementFail } from '../utils/sfx.js';
import battle from './battle.js';

let controller = null;
let draggedShipData = null;

function init(gameController) {
    controller = gameController;
    loadSetupContent();
}

function loadSetupContent() {
    const contentLeft = document.getElementById('content-left');
    contentLeft.innerHTML = '';

    const setupContainer = document.createElement('div');
    setupContainer.className = 'setup-container';

    const gridSection = document.createElement('div');
    gridSection.className = 'grid-section';

    const title = document.createElement('h2');
    title.className = 'setup-title';
    title.textContent = 'Place Your Fleet';
    gridSection.appendChild(title);

    const map = support.createMap('player');
    gridSection.appendChild(map);
    setupContainer.appendChild(gridSection);

    const dock = createDock();
    setupContainer.appendChild(dock);

    contentLeft.appendChild(setupContainer);

    initGridListeners();
}

function createDock() {
    const dock = document.createElement('div');
    dock.className = 'dock';

    const dockTitle = document.createElement('h3');
    dockTitle.className = 'dock-title';
    dockTitle.textContent = 'Fleet Dock';
    dock.appendChild(dockTitle);

    const shipList = document.createElement('div');
    shipList.className = 'ship-list';
    shipList.id = 'ship-list';

    const ships = controller.getShipsToPlace();
    ships.forEach(ship => {
        const item = createShipItem(ship);
        shipList.appendChild(item);
    });

    dock.appendChild(shipList);
    dock.appendChild(createButtons());

    return dock;
}

function createShipItem(ship) {
    const item = document.createElement('div');
    item.className = 'ship-item';
    item.id = `ship-${ship.name}`;
    item.dataset.shipName = ship.name;
    item.dataset.shipSize = ship.size;
    item.draggable = true;

    const svgContainer = document.createElement('div');
    svgContainer.className = 'ship-svg-container';
    svgContainer.innerHTML = getSvg(ship.name, ship.size, controller.orientation);
    item.appendChild(svgContainer);

    const label = document.createElement('span');
    label.className = 'ship-label';
    label.textContent = `${ship.name} (${ship.size})`;
    item.appendChild(label);

    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragend', onDragEnd);

    return item;
}

function createButtons() {
    const btnGroup = document.createElement('div');
    btnGroup.className = 'setup-buttons';

    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'setup-btn';
    rotateBtn.id = 'rotate-btn';
    rotateBtn.textContent = 'Rotate';
    rotateBtn.addEventListener('click', onRotate);

    const randomBtn = document.createElement('button');
    randomBtn.className = 'setup-btn';
    randomBtn.id = 'random-btn';
    randomBtn.textContent = 'Random';
    randomBtn.addEventListener('click', onRandom);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'setup-btn';
    resetBtn.id = 'reset-btn';
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', onReset);

    const startBtn = document.createElement('button');
    startBtn.className = 'setup-btn start-btn';
    startBtn.id = 'start-btn';
    startBtn.textContent = 'Start Battle';
    startBtn.disabled = true;
    startBtn.addEventListener('click', onStartBattle);

    support.appendAll(btnGroup, [rotateBtn, randomBtn, resetBtn, startBtn]);
    return btnGroup;
}

function initGridListeners() {
    const fieldContainer = document.getElementById('field-container-player');
    if (!fieldContainer) return;

    fieldContainer.addEventListener('dragover', onDragOver);
    fieldContainer.addEventListener('dragleave', onDragLeave);
    fieldContainer.addEventListener('drop', onDrop);
}

// --- Drag & Drop ---

function onDragStart(e) {
    const item = e.currentTarget;
    draggedShipData = {
        name: item.dataset.shipName,
        size: parseInt(item.dataset.shipSize, 10),
    };
    item.classList.add('dragging');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.shipName);

    const svgEl = item.querySelector('svg');
    if (svgEl) {
        const clone = svgEl.cloneNode(true);
        clone.style.opacity = '0.8';
        const wrap = document.createElement('div');
        wrap.style.position = 'absolute';
        wrap.style.top = '-9999px';
        wrap.appendChild(clone);
        document.body.appendChild(wrap);
        e.dataTransfer.setDragImage(wrap, 0, 0);
        setTimeout(() => wrap.remove(), 0);
    }
}

function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    draggedShipData = null;
    clearPreview();
}

function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const cell = e.target.closest('.field');
    if (!cell || !draggedShipData) return;

    clearPreview();

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const { name, size } = draggedShipData;
    const orientation = controller.orientation;

    const possible = controller.game.playerBoard.isPlacementPossible(
        { size },
        row,
        col,
        orientation
    );

    const cells = getCellsForShip(row, col, size, orientation);
    const cls = possible ? 'preview-valid' : 'preview-invalid';
    cells.forEach(c => {
        if (c) c.classList.add(cls);
    });
}

function onDragLeave(e) {
    const fieldContainer = document.getElementById('field-container-player');
    if (fieldContainer && !fieldContainer.contains(e.relatedTarget)) {
        clearPreview();
    }
}

function onDrop(e) {
    e.preventDefault();
    clearPreview();

    const cell = e.target.closest('.field');
    if (!cell || !draggedShipData) return;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const { name, size } = draggedShipData;
    const orientation = controller.orientation;

    const placed = controller.placePlayerShip({ name, size }, row, col, orientation);

    if (placed) {
        placementSuccess();
        renderShipOnGrid(name, size, row, col, orientation);
        removeShipFromDock(name);
        updateStartButton();
    } else {
        placementFail();
    }

    draggedShipData = null;
}

// --- Helpers ---

function getCellsForShip(row, col, size, orientation) {
    const container = document.getElementById('field-container-player');
    if (!container) return [];

    const cells = [];
    for (let i = 0; i < size; i++) {
        const r = orientation === 'Y' ? row + i : row;
        const c = orientation === 'X' ? col + i : col;
        const cell = container.querySelector(`.field[data-row="${r}"][data-col="${c}"]`);
        cells.push(cell);
    }
    return cells;
}

function clearPreview() {
    const container = document.getElementById('field-container-player');
    if (!container) return;
    container.querySelectorAll('.preview-valid, .preview-invalid').forEach(c => {
        c.classList.remove('preview-valid', 'preview-invalid');
    });
}

function renderShipOnGrid(name, size, row, col, orientation) {
    const cells = getCellsForShip(row, col, size, orientation);
    cells.forEach((cell, i) => {
        if (!cell) return;
        cell.classList.add('ship-placed');
        cell.dataset.shipName = name;
    });

    const container = document.getElementById('field-container-player');
    if (!container) return;

    const overlay = document.createElement('div');
    overlay.className = 'ship-overlay';
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

function removeShipFromDock(name) {
    const item = document.getElementById(`ship-${name}`);
    if (item) {
        item.classList.add('placed');
        item.draggable = false;
    }
}

function restoreShipToDock(name) {
    const item = document.getElementById(`ship-${name}`);
    if (item) {
        item.classList.remove('placed');
        item.draggable = true;
    }
}

function updateStartButton() {
    const btn = document.getElementById('start-btn');
    if (!btn) return;
    btn.disabled = controller.getCurrentShipToPlace() !== null;
}

// --- Button handlers ---

function onRotate() {
    controller.rotateOrientation();
    const orientation = controller.orientation;

    document.querySelectorAll('.ship-item:not(.placed) .ship-svg-container').forEach(container => {
        if (orientation === 'Y') {
            container.classList.add('rotated');
        } else {
            container.classList.remove('rotated');
        }
    });
}

function onRandom() {
    onReset();

    const ships = controller.getShipsToPlace();
    ships.forEach(ship => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const orient = Math.random() < 0.5 ? 'X' : 'Y';
            placed = controller.placePlayerShip(ship, row, col, orient);
            if (placed) {
                renderShipOnGrid(ship.name, ship.size, row, col, orient);
                removeShipFromDock(ship.name);
            }
        }
    });

    placementSuccess();
    updateStartButton();
}

function onReset() {
    controller.resetPlacement();

    const container = document.getElementById('field-container-player');
    if (container) {
        container.querySelectorAll('.ship-placed').forEach(c => {
            c.classList.remove('ship-placed');
            delete c.dataset.shipName;
        });
        container.querySelectorAll('.ship-overlay').forEach(o => o.remove());
    }

    const ships = controller.getShipsToPlace();
    ships.forEach(ship => restoreShipToDock(ship.name));

    updateStartButton();
}

function onStartBattle() {
    const started = controller.startBattle();
    if (!started) return;
    battle.init(controller);
}

export default { init };
