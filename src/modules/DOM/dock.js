import { getSvg } from '../utils/shipSvgs.js';
import support from './support.js';
import { placementSuccess } from '../utils/sfx.js';
import battle from './battle.js';

let controller = null;
let _clearTouchSelection = null;

// --- Grid helpers (shared with dragDrop via setup.js callbacks) ---

export function getCellsForShip(row, col, size, orientation) {
  const container = document.getElementById('field-container-player');
  if (!container) return [];

  const cells = [];
  for (let i = 0; i < size; i++) {
    const r = orientation === 'Y' ? row + i : row;
    const c = orientation === 'X' ? col + i : col;
    const cell = container.querySelector(
      `.field[data-row="${r}"][data-col="${c}"]`
    );
    cells.push(cell);
  }
  return cells;
}

export function renderShipOnGrid(name, size, row, col, orientation) {
  const cells = getCellsForShip(row, col, size, orientation);
  cells.forEach((cell) => {
    if (!cell) return;
    cell.classList.add('ship-placed');
    cell.dataset.shipName = name;
  });

  const container = document.getElementById('field-container-player');
  if (!container) return;

  const cellSize = support.getCellSize();

  const overlay = document.createElement('div');
  overlay.className = 'ship-overlay';
  overlay.dataset.shipName = name;

  const widthCells = orientation === 'X' ? size : 1;
  const heightCells = orientation === 'Y' ? size : 1;

  overlay.style.left = `${col * cellSize}px`;
  overlay.style.top = `${row * cellSize}px`;
  overlay.style.width = `${widthCells * cellSize}px`;
  overlay.style.height = `${heightCells * cellSize}px`;

  const svgWrap = document.createElement('div');
  svgWrap.className = 'ship-overlay-svg';
  if (orientation === 'Y') {
    svgWrap.classList.add('rotated');
    svgWrap.style.width = `${size * cellSize}px`;
    svgWrap.style.height = `${cellSize}px`;
  }
  // Safe: SVG content is hardcoded in shipSvgs.js — no user input reaches getSvg()
  svgWrap.insertAdjacentHTML('beforeend', getSvg(name, size, orientation));
  overlay.appendChild(svgWrap);

  container.appendChild(overlay);
}

// --- Dock item state ---

export function removeShipFromDock(name) {
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

export function updateStartButton() {
  const btn = document.getElementById('start-btn');
  if (!btn) return;
  btn.disabled = controller.getCurrentShipToPlace() !== null;
}

// --- Dock item creation ---

function createShipItem(ship, onDragStart, onDragEnd, onShipTap) {
  const item = document.createElement('div');
  item.className = 'ship-item';
  item.id = `ship-${ship.name}`;
  item.dataset.shipName = ship.name;
  item.dataset.shipSize = ship.size;
  item.draggable = true;

  const svgContainer = document.createElement('div');
  svgContainer.className = 'ship-svg-container';
  // Safe: SVG content is hardcoded in shipSvgs.js — no user input reaches getSvg()
  svgContainer.insertAdjacentHTML('beforeend', getSvg(ship.name, ship.size, controller.orientation));
  item.appendChild(svgContainer);

  const label = document.createElement('span');
  label.className = 'ship-label';
  label.textContent = `${ship.name} (${ship.size})`;
  item.appendChild(label);

  item.addEventListener('dragstart', onDragStart);
  item.addEventListener('dragend', onDragEnd);
  item.addEventListener('click', onShipTap); // touch fallback: 2-tap placement

  return item;
}

// --- Button handlers ---

function onRotate() {
  controller.rotateOrientation();
  const orientation = controller.orientation;

  document
    .querySelectorAll('.ship-item:not(.placed) .ship-svg-container')
    .forEach((container) => {
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
  ships.forEach((ship) => {
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
    container.querySelectorAll('.ship-placed').forEach((c) => {
      c.classList.remove('ship-placed');
      delete c.dataset.shipName;
    });
    container.querySelectorAll('.ship-overlay').forEach((o) => o.remove());
  }

  const ships = controller.getShipsToPlace();
  ships.forEach((ship) => restoreShipToDock(ship.name));

  if (_clearTouchSelection) _clearTouchSelection();

  updateStartButton();
}

function onStartBattle() {
  const started = controller.startBattle();
  if (!started) return;
  battle.init(controller);
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

// --- Public factory ---

export function createDock(ctrl, onDragStart, onDragEnd, onShipTap, clearTouchSelection) {
  controller = ctrl;
  _clearTouchSelection = clearTouchSelection ?? null;

  const dock = document.createElement('div');
  dock.className = 'dock';

  const dockTitle = document.createElement('h3');
  dockTitle.className = 'dock-title';
  dockTitle.textContent = 'Fleet Dock';
  dock.appendChild(dockTitle);

  const shipList = document.createElement('div');
  shipList.className = 'ship-list';
  shipList.id = 'ship-list';

  ctrl.getShipsToPlace().forEach((ship) => {
    shipList.appendChild(createShipItem(ship, onDragStart, onDragEnd, onShipTap));
  });

  dock.appendChild(shipList);
  dock.appendChild(createButtons());

  return dock;
}
