import { placementSuccess, placementFail } from '../utils/sfx.js';

let draggedShipData = null;

// --- Preview helpers (internal) ---

function clearPreview() {
  const container = document.getElementById('field-container-player');
  if (!container) return;
  container
    .querySelectorAll('.preview-valid, .preview-invalid')
    .forEach((c) => {
      c.classList.remove('preview-valid', 'preview-invalid');
    });
}

// --- Drag handlers (exported for attachment in dock.js via setup.js) ---

export function onDragStart(e) {
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

export function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedShipData = null;
  clearPreview();
}

// --- Grid listeners (internal handlers) ---

function onDragOver(e, controller, getCellsForShip) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  const cell = e.target.closest('.field');
  if (!cell || !draggedShipData) return;

  clearPreview();

  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);
  const { size } = draggedShipData;
  const orientation = controller.orientation;

  const possible = controller.game.playerBoard.isPlacementPossible(
    { size },
    row,
    col,
    orientation
  );

  const cells = getCellsForShip(row, col, size, orientation);
  const cls = possible ? 'preview-valid' : 'preview-invalid';
  cells.forEach((c) => {
    if (c) c.classList.add(cls);
  });
}

function onDragLeave(e) {
  const fieldContainer = document.getElementById('field-container-player');
  if (fieldContainer && !fieldContainer.contains(e.relatedTarget)) {
    clearPreview();
  }
}

function onDrop(e, controller, helpers) {
  e.preventDefault();
  clearPreview();

  const cell = e.target.closest('.field');
  if (!cell || !draggedShipData) return;

  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);
  const { name, size } = draggedShipData;
  const orientation = controller.orientation;

  const placed = controller.placePlayerShip(
    { name, size },
    row,
    col,
    orientation
  );

  if (placed) {
    placementSuccess();
    helpers.renderShipOnGrid(name, size, row, col, orientation);
    helpers.removeShipFromDock(name);
    helpers.updateStartButton();
  } else {
    placementFail();
  }

  draggedShipData = null;
}

// --- Public init ---

export function initGridListeners(controller, helpers) {
  const fieldContainer = document.getElementById('field-container-player');
  if (!fieldContainer) return;

  fieldContainer.addEventListener('dragover', (e) =>
    onDragOver(e, controller, helpers.getCellsForShip)
  );
  fieldContainer.addEventListener('dragleave', onDragLeave);
  fieldContainer.addEventListener('drop', (e) => onDrop(e, controller, helpers));
}
