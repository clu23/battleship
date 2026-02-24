const BOARD_SIZE = 10;

class AI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.reset();
    }

    reset() {
        this.mode = 'search';       // 'search' | 'hunt'
        this.huntQueue = [];        // cells to try in hunt mode
        this.huntHits = [];         // confirmed hits for the current unsunk ship
        this.huntDirection = null;  // null | 'H' | 'V'
        this.attacked = new Set();  // "row,col" strings already attacked
        this._searchOrder = null;   // computed lazily on first search move
    }

    // ── Public interface ──────────────────────────────────────────────────────

    /**
     * Returns { row, col } for the next attack.
     * Must be called before recordResult().
     */
    getNextMove() {
        if (this.difficulty !== 'easy' && this.mode === 'hunt') {
            // Purge cells that were already attacked (e.g. from a prior session overlap)
            this.huntQueue = this.huntQueue.filter(
                c => !this._alreadyAttacked(c.row, c.col)
            );

            if (this.huntQueue.length > 0) {
                return { ...this.huntQueue[0] };
            }

            // Queue exhausted without sinking → something went wrong; fall back
            this._clearHunt();
        }

        return this._searchMove();
    }

    /**
     * Informs the AI of the result of the last attack.
     * result: { result: 'hit'|'miss'|'already', ship?, sunk? }
     */
    recordResult(row, col, result) {
        this.attacked.add(this._key(row, col));

        if (this.difficulty === 'easy') return;
        if (result.result === 'miss') return;
        if (result.result !== 'hit') return;

        if (result.sunk) {
            this._clearHunt();
            return;
        }

        // Non-sinking hit
        this.huntHits.push({ row, col });

        if (this.huntHits.length === 1) {
            // First hit — add 4 cardinal neighbours
            this.mode = 'hunt';
            this._addNeighbors(row, col);
        } else {
            // 2nd+ hit — we know (or can refine) the direction
            this._rebuildHuntQueue();
        }
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    _key(row, col) {
        return `${row},${col}`;
    }

    _alreadyAttacked(row, col) {
        return this.attacked.has(this._key(row, col));
    }

    _clearHunt() {
        this.mode = 'search';
        this.huntQueue = [];
        this.huntHits = [];
        this.huntDirection = null;
    }

    _addNeighbors(row, col) {
        const candidates = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 },
        ].filter(
            c =>
                c.row >= 0 &&
                c.row < BOARD_SIZE &&
                c.col >= 0 &&
                c.col < BOARD_SIZE &&
                !this._alreadyAttacked(c.row, c.col)
        );
        this.huntQueue.push(...candidates);
    }

    /**
     * After ≥2 hits, rebuild huntQueue from the known line of hits.
     * Determines direction and extends in both directions past the hit line.
     */
    _rebuildHuntQueue() {
        if (this.huntHits.length < 2) return;

        if (this.huntDirection === null) {
            const h0 = this.huntHits[0];
            const h1 = this.huntHits[1];
            this.huntDirection = h0.row === h1.row ? 'H' : 'V';
        }

        this.huntQueue = [];

        if (this.huntDirection === 'H') {
            const row = this.huntHits[0].row;
            const cols = this.huntHits.map(h => h.col).sort((a, b) => a - b);
            const minCol = cols[0];
            const maxCol = cols[cols.length - 1];

            if (minCol > 0 && !this._alreadyAttacked(row, minCol - 1)) {
                this.huntQueue.push({ row, col: minCol - 1 });
            }
            if (maxCol < BOARD_SIZE - 1 && !this._alreadyAttacked(row, maxCol + 1)) {
                this.huntQueue.push({ row, col: maxCol + 1 });
            }
        } else {
            const col = this.huntHits[0].col;
            const rows = this.huntHits.map(h => h.row).sort((a, b) => a - b);
            const minRow = rows[0];
            const maxRow = rows[rows.length - 1];

            if (minRow > 0 && !this._alreadyAttacked(minRow - 1, col)) {
                this.huntQueue.push({ row: minRow - 1, col });
            }
            if (maxRow < BOARD_SIZE - 1 && !this._alreadyAttacked(maxRow + 1, col)) {
                this.huntQueue.push({ row: maxRow + 1, col });
            }
        }
    }

    _buildSearchOrder() {
        const cells = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                cells.push({ row: r, col: c });
            }
        }

        if (this.difficulty === 'hard') {
            // Checkerboard cells first (row+col even), remainder after.
            // Within each group, prioritise cells closer to the centre.
            const center = (BOARD_SIZE - 1) / 2; // 4.5
            const dist = (r, c) => Math.abs(r - center) + Math.abs(c - center);

            const checker = cells.filter(c => (c.row + c.col) % 2 === 0);
            const rest    = cells.filter(c => (c.row + c.col) % 2 !== 0);

            // Sort by distance to centre; shuffle within each distance bucket
            const sortByCenter = arr => {
                // Group by integer distance, shuffle each group, then reassemble
                const groups = {};
                arr.forEach(c => {
                    const d = Math.round(dist(c.row, c.col));
                    if (!groups[d]) groups[d] = [];
                    groups[d].push(c);
                });
                const result = [];
                Object.keys(groups)
                    .map(Number)
                    .sort((a, b) => a - b)
                    .forEach(d => {
                        const g = groups[d];
                        for (let i = g.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [g[i], g[j]] = [g[j], g[i]];
                        }
                        result.push(...g);
                    });
                return result;
            };

            this._searchOrder = [...sortByCenter(checker), ...sortByCenter(rest)];
        } else {
            // Easy / Medium: fully random order
            for (let i = cells.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cells[i], cells[j]] = [cells[j], cells[i]];
            }
            this._searchOrder = cells;
        }
    }

    _searchMove() {
        if (!this._searchOrder) {
            this._buildSearchOrder();
        }

        for (const cell of this._searchOrder) {
            if (!this._alreadyAttacked(cell.row, cell.col)) {
                return { row: cell.row, col: cell.col };
            }
        }

        return null; // board exhausted (should never happen mid-game)
    }
}

export default AI;
