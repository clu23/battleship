import AI from '../factories/ai.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Build a fake board result object */
const miss = () => ({ result: 'miss' });
const hit  = (sunk = false) => ({ result: 'hit', sunk });

/** Let the AI attack up to N times, collect {row,col} pairs */
function collectMoves(ai, n) {
    const moves = [];
    for (let i = 0; i < n; i++) {
        const move = ai.getNextMove();
        if (!move) break;
        moves.push(move);
        ai.recordResult(move.row, move.col, miss());
    }
    return moves;
}

// ─── Easy ─────────────────────────────────────────────────────────────────────

describe('AI — Easy', () => {
    test('returns valid coordinates within 0–9 range', () => {
        const ai = new AI('easy');
        for (let i = 0; i < 20; i++) {
            const { row, col } = ai.getNextMove();
            ai.recordResult(row, col, miss());
            expect(row).toBeGreaterThanOrEqual(0);
            expect(row).toBeLessThanOrEqual(9);
            expect(col).toBeGreaterThanOrEqual(0);
            expect(col).toBeLessThanOrEqual(9);
        }
    });

    test('never attacks the same cell twice', () => {
        const ai = new AI('easy');
        const moves = collectMoves(ai, 100);
        const keys = moves.map(m => `${m.row},${m.col}`);
        const unique = new Set(keys);
        expect(unique.size).toBe(moves.length);
    });

    test('covers all 100 cells over a full game', () => {
        const ai = new AI('easy');
        const moves = collectMoves(ai, 100);
        expect(moves).toHaveLength(100);
    });

    test('stays in search mode even after a hit (no hunt)', () => {
        const ai = new AI('easy');
        const m = ai.getNextMove();
        ai.recordResult(m.row, m.col, hit(false));
        expect(ai.mode).toBe('search');
        expect(ai.huntQueue).toHaveLength(0);
    });
});

// ─── Medium ───────────────────────────────────────────────────────────────────

describe('AI — Medium', () => {
    test('returns valid coordinates', () => {
        const ai = new AI('medium');
        for (let i = 0; i < 20; i++) {
            const { row, col } = ai.getNextMove();
            ai.recordResult(row, col, miss());
            expect(row).toBeGreaterThanOrEqual(0);
            expect(row).toBeLessThanOrEqual(9);
            expect(col).toBeGreaterThanOrEqual(0);
            expect(col).toBeLessThanOrEqual(9);
        }
    });

    test('never attacks the same cell twice', () => {
        const ai = new AI('medium');
        const moves = collectMoves(ai, 50);
        const keys = moves.map(m => `${m.row},${m.col}`);
        const unique = new Set(keys);
        expect(unique.size).toBe(moves.length);
    });

    test('switches to hunt mode after a hit', () => {
        const ai = new AI('medium');
        const m = ai.getNextMove();
        ai.recordResult(m.row, m.col, hit(false));
        expect(ai.mode).toBe('hunt');
        expect(ai.huntQueue.length).toBeGreaterThan(0);
    });

    test('hunt queue contains only adjacent cells to the hit', () => {
        const ai = new AI('medium');
        // Force first move to (5,5) by pre-filling the search order
        ai._searchOrder = [{ row: 5, col: 5 }];
        const m = ai.getNextMove();             // (5,5)
        ai.recordResult(5, 5, hit(false));

        // Valid adjacent cells to (5,5): up(4,5) down(6,5) left(5,4) right(5,6)
        const adjacentKeys = ['4,5', '6,5', '5,4', '5,6'];
        ai.huntQueue.forEach(c => {
            expect(adjacentKeys).toContain(`${c.row},${c.col}`);
        });
        expect(ai.huntQueue.length).toBe(4);
    });

    test('determines horizontal direction after two collinear hits', () => {
        const ai = new AI('medium');

        // First hit at (3, 3)
        ai._searchOrder = [{ row: 3, col: 3 }];
        let m = ai.getNextMove();
        ai.recordResult(3, 3, hit(false));
        expect(ai.huntDirection).toBeNull();

        // Force next hunt move to (3,4) — right of first hit
        ai.huntQueue = [{ row: 3, col: 4 }];
        m = ai.getNextMove();
        ai.recordResult(3, 4, hit(false));

        expect(ai.huntDirection).toBe('H');
    });

    test('determines vertical direction after two collinear hits', () => {
        const ai = new AI('medium');

        ai._searchOrder = [{ row: 3, col: 3 }];
        ai.getNextMove();
        ai.recordResult(3, 3, hit(false));

        ai.huntQueue = [{ row: 4, col: 3 }];
        ai.getNextMove();
        ai.recordResult(4, 3, hit(false));

        expect(ai.huntDirection).toBe('V');
    });

    test('resets to search mode after ship is sunk', () => {
        const ai = new AI('medium');
        const m = ai.getNextMove();
        ai.recordResult(m.row, m.col, hit(true));   // sunk immediately

        expect(ai.mode).toBe('search');
        expect(ai.huntQueue).toHaveLength(0);
        expect(ai.huntHits).toHaveLength(0);
        expect(ai.huntDirection).toBeNull();
    });

    test('extends hunt queue beyond last hit in known direction', () => {
        const ai = new AI('medium');

        // Hit at (2,2)
        ai._searchOrder = [{ row: 2, col: 2 }];
        ai.getNextMove();
        ai.recordResult(2, 2, hit(false));

        // Hit at (2,3)
        ai.huntQueue = [{ row: 2, col: 3 }];
        ai.getNextMove();
        ai.recordResult(2, 3, hit(false));

        // Queue should now contain extensions: (2,1) and (2,4)
        const keys = ai.huntQueue.map(c => `${c.row},${c.col}`);
        expect(keys).toContain('2,1');
        expect(keys).toContain('2,4');
    });

    test('covers all 100 cells over a full game without repeats', () => {
        const ai = new AI('medium');
        const moves = collectMoves(ai, 100);
        const keys = moves.map(m => `${m.row},${m.col}`);
        const unique = new Set(keys);
        expect(unique.size).toBe(100);
    });
});

// ─── Hard ─────────────────────────────────────────────────────────────────────

describe('AI — Hard', () => {
    test('returns valid coordinates', () => {
        const ai = new AI('hard');
        for (let i = 0; i < 20; i++) {
            const { row, col } = ai.getNextMove();
            ai.recordResult(row, col, miss());
            expect(row).toBeGreaterThanOrEqual(0);
            expect(row).toBeLessThanOrEqual(9);
            expect(col).toBeGreaterThanOrEqual(0);
            expect(col).toBeLessThanOrEqual(9);
        }
    });

    test('never attacks the same cell twice', () => {
        const ai = new AI('hard');
        const moves = collectMoves(ai, 50);
        const keys = moves.map(m => `${m.row},${m.col}`);
        const unique = new Set(keys);
        expect(unique.size).toBe(moves.length);
    });

    test('uses checkerboard pattern in search mode: first 50 moves all have (row+col) % 2 === 0', () => {
        const ai = new AI('hard');
        // Force build of search order
        ai._buildSearchOrder();

        const first50 = ai._searchOrder.slice(0, 50);
        first50.forEach(({ row, col }) => {
            expect((row + col) % 2).toBe(0);
        });
    });

    test('last 50 search cells are the non-checkerboard cells', () => {
        const ai = new AI('hard');
        ai._buildSearchOrder();

        const last50 = ai._searchOrder.slice(50);
        last50.forEach(({ row, col }) => {
            expect((row + col) % 2).toBe(1);
        });
    });

    test('checkerboard contains exactly 50 cells', () => {
        const ai = new AI('hard');
        ai._buildSearchOrder();
        const checker = ai._searchOrder.filter(c => (c.row + c.col) % 2 === 0);
        expect(checker).toHaveLength(50);
    });

    test('switches to hunt mode and targets adjacents after a hit', () => {
        const ai = new AI('hard');
        ai._searchOrder = [{ row: 4, col: 4 }];
        ai.getNextMove();
        ai.recordResult(4, 4, hit(false));

        expect(ai.mode).toBe('hunt');
        const keys = ai.huntQueue.map(c => `${c.row},${c.col}`);
        ['3,4', '5,4', '4,3', '4,5'].forEach(k => {
            expect(keys).toContain(k);
        });
    });

    test('covers all 100 cells over a full game without repeats', () => {
        const ai = new AI('hard');
        const moves = collectMoves(ai, 100);
        const keys = moves.map(m => `${m.row},${m.col}`);
        const unique = new Set(keys);
        expect(unique.size).toBe(100);
    });
});
