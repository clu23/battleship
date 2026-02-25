import { getSvg } from '../utils/shipSvgs.js';

const SHIPS = [
  { name: 'Carrier', displayName: 'Carrier', size: 5 },
  { name: 'Battleship', displayName: 'Battleship', size: 4 },
  { name: 'Destroyer', displayName: 'Destroyer', size: 3 },
  { name: 'Submarine', displayName: 'Submarine', size: 3 },
  { name: 'PatrolBoat', displayName: 'Patrol Boat', size: 2 },
];

const MINI_CELL = 25;

function createPanel(title) {
  const panel = document.createElement('div');
  panel.className = 'score-panel';

  const heading = document.createElement('h3');
  heading.className = 'score-panel-title';
  heading.textContent = title;
  panel.appendChild(heading);

  const list = document.createElement('ul');
  list.className = 'score-panel-list';

  SHIPS.forEach((ship) => {
    const li = document.createElement('li');
    li.className = 'score-ship';
    li.dataset.shipName = ship.name;

    const svgWrap = document.createElement('div');
    svgWrap.className = 'score-ship-svg';
    svgWrap.style.width = `${ship.size * MINI_CELL}px`;
    svgWrap.style.height = `${MINI_CELL}px`;
    svgWrap.innerHTML = getSvg(ship.name, ship.size, 'X');
    li.appendChild(svgWrap);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'score-ship-name';
    nameSpan.textContent = ship.displayName;
    li.appendChild(nameSpan);

    const status = document.createElement('span');
    status.className = 'score-ship-status';
    li.appendChild(status);

    list.appendChild(li);
  });

  panel.appendChild(list);
  return panel;
}

function updatePlayerPanel(board) {
  const panel = document.querySelector('#content-left .score-panel');
  if (!panel) return;

  board.fleet.forEach((ship) => {
    const li = panel.querySelector(`[data-ship-name="${ship.name}"]`);
    if (!li) return;

    if (ship.isSunk()) {
      li.classList.add('score-sunk');
      li.querySelector('.score-ship-status').textContent = '\u2620';
    }
  });
}

function updateEnemyPanel(attackResult) {
  if (!attackResult || attackResult.result !== 'hit' || !attackResult.sunk)
    return;

  const panel = document.querySelector('#content-right .score-panel');
  if (!panel) return;

  const ship = attackResult.ship;
  const li = panel.querySelector(`[data-ship-name="${ship.name}"]`);
  if (!li) return;

  li.classList.add('score-sunk');
  li.querySelector('.score-ship-status').textContent = '\u2620';
}

export { createPanel, updatePlayerPanel, updateEnemyPanel };
