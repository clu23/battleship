import support from './support.js';
import {
  createDock,
  getCellsForShip,
  renderShipOnGrid,
  removeShipFromDock,
  updateStartButton,
} from './dock.js';
import {
  onDragStart,
  onDragEnd,
  onShipTap,
  clearTouchSelection,
  initGridListeners,
} from './dragDrop.js';

let controller = null;

function init(gameController) {
  controller = gameController;
  loadSetupContent();
}

function loadSetupContent() {
  const contentLeft = document.getElementById('content-left');
  contentLeft.replaceChildren();

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

  const dock = createDock(controller, onDragStart, onDragEnd, onShipTap, clearTouchSelection);
  setupContainer.appendChild(dock);

  contentLeft.appendChild(setupContainer);

  initGridListeners(controller, {
    getCellsForShip,
    renderShipOnGrid,
    removeShipFromDock,
    updateStartButton,
  });
}

export default { init };
