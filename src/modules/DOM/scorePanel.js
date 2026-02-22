const SHIPS = [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Destroyer', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'PatrolBoat', displayName: 'Patrol Boat', size: 2 },
];

function createPanel(title) {
    const panel = document.createElement('div');
    panel.className = 'score-panel';

    const heading = document.createElement('h3');
    heading.className = 'score-panel-title';
    heading.textContent = title;
    panel.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'score-panel-list';

    SHIPS.forEach(ship => {
        const li = document.createElement('li');
        li.className = 'score-ship';
        li.dataset.shipName = ship.name;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'score-ship-name';
        nameSpan.textContent = ship.displayName || ship.name;
        li.appendChild(nameSpan);

        const squares = document.createElement('span');
        squares.className = 'score-ship-squares';
        for (let i = 0; i < ship.size; i++) {
            const sq = document.createElement('span');
            sq.className = 'score-square';
            sq.dataset.index = i;
            squares.appendChild(sq);
        }
        li.appendChild(squares);

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

    board.fleet.forEach(ship => {
        const li = panel.querySelector(`[data-ship-name="${ship.name}"]`);
        if (!li) return;

        const squares = li.querySelectorAll('.score-square');
        const status = li.querySelector('.score-ship-status');

        if (ship.isSunk()) {
            li.classList.add('score-sunk');
            li.classList.remove('score-damaged');
            squares.forEach(sq => sq.classList.add('score-square-hit'));
            status.textContent = '\u2717';
        } else if (ship.hits > 0) {
            li.classList.add('score-damaged');
            squares.forEach((sq, i) => {
                if (i < ship.hits) {
                    sq.classList.add('score-square-hit');
                } else {
                    sq.classList.remove('score-square-hit');
                }
            });
            status.textContent = '';
        }
    });
}

function updateEnemyPanel(attackResult) {
    if (!attackResult || attackResult.result !== 'hit' || !attackResult.sunk) return;

    const panel = document.querySelector('#content-right .score-panel');
    if (!panel) return;

    const ship = attackResult.ship;
    const li = panel.querySelector(`[data-ship-name="${ship.name}"]`);
    if (!li) return;

    const squares = li.querySelectorAll('.score-square');
    const status = li.querySelector('.score-ship-status');

    li.classList.add('score-sunk');
    squares.forEach(sq => sq.classList.add('score-square-hit'));
    status.textContent = '\u2717';
}

export { createPanel, updatePlayerPanel, updateEnemyPanel };
