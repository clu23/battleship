const CELL_SIZE = 36;

const svgTemplates = {
  Carrier(w, h) {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
            <!-- Hull -->
            <rect x="2" y="4" width="${w - 4}" height="${h - 8}" rx="6" ry="6" fill="#4a4a4a" stroke="#333" stroke-width="1.5"/>
            <!-- Flight deck -->
            <rect x="6" y="8" width="${w - 12}" height="${h - 16}" rx="3" fill="#5a5a5a"/>
            <!-- Deck lines -->
            <line x1="12" y1="${h / 2}" x2="${w - 12}" y2="${h / 2}" stroke="#777" stroke-width="0.8" stroke-dasharray="4,3"/>
            <line x1="12" y1="${h / 2 - 5}" x2="${w - 12}" y2="${h / 2 - 5}" stroke="#666" stroke-width="0.5" stroke-dasharray="3,4"/>
            <line x1="12" y1="${h / 2 + 5}" x2="${w - 12}" y2="${h / 2 + 5}" stroke="#666" stroke-width="0.5" stroke-dasharray="3,4"/>
            <!-- Island (control tower) -->
            <rect x="${w - 50}" y="6" width="16" height="10" rx="2" fill="#3a3a3a" stroke="#222" stroke-width="1"/>
            <rect x="${w - 48}" y="3" width="4" height="3" rx="1" fill="#333"/>
            <!-- Bow arrow -->
            <polygon points="${w - 8},${h / 2} ${w - 16},${h / 2 - 4} ${w - 16},${h / 2 + 4}" fill="#666"/>
            <!-- Aircraft silhouettes on deck -->
            <g fill="#6a6a6a" opacity="0.6">
                <rect x="14" y="${h / 2 - 6}" width="10" height="4" rx="1"/>
                <rect x="30" y="${h / 2 + 2}" width="10" height="4" rx="1"/>
                <rect x="50" y="${h / 2 - 6}" width="10" height="4" rx="1"/>
                <rect x="70" y="${h / 2 + 2}" width="10" height="4" rx="1"/>
            </g>
        </svg>`;
  },

  Battleship(w, h) {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
            <!-- Hull -->
            <path d="M 8,${h / 2} Q 2,${h / 2} 4,${h / 2 - 8} L 10,${h / 2 - 10} L ${w - 10},${h / 2 - 10} Q ${w - 2},${h / 2 - 8} ${w - 2},${h / 2} Q ${w - 2},${h / 2 + 8} ${w - 10},${h / 2 + 10} L 10,${h / 2 + 10} Q 2,${h / 2 + 8} 4,${h / 2 + 8} Z" fill="#5a6a7a" stroke="#3a4a5a" stroke-width="1.5"/>
            <!-- Superstructure -->
            <rect x="${w / 2 - 18}" y="${h / 2 - 7}" width="36" height="14" rx="3" fill="#4a5a6a" stroke="#3a4a5a" stroke-width="1"/>
            <!-- Bridge -->
            <rect x="${w / 2 - 8}" y="${h / 2 - 9}" width="16" height="18" rx="2" fill="#3a4a5a"/>
            <!-- Forward turrets -->
            <circle cx="24" cy="${h / 2}" r="6" fill="#4a5a6a" stroke="#3a4a5a" stroke-width="1"/>
            <line x1="24" y1="${h / 2}" x2="12" y2="${h / 2}" stroke="#3a4a5a" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="${w / 2 - 26}" cy="${h / 2}" r="5" fill="#4a5a6a" stroke="#3a4a5a" stroke-width="1"/>
            <line x1="${w / 2 - 26}" y1="${h / 2}" x2="${w / 2 - 38}" y2="${h / 2}" stroke="#3a4a5a" stroke-width="2" stroke-linecap="round"/>
            <!-- Aft turrets -->
            <circle cx="${w - 24}" cy="${h / 2}" r="6" fill="#4a5a6a" stroke="#3a4a5a" stroke-width="1"/>
            <line x1="${w - 24}" y1="${h / 2}" x2="${w - 12}" y2="${h / 2}" stroke="#3a4a5a" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Bow -->
            <polygon points="4,${h / 2} 10,${h / 2 - 6} 10,${h / 2 + 6}" fill="#5a6a7a" stroke="#3a4a5a" stroke-width="0.5"/>
        </svg>`;
  },

  Destroyer(w, h) {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
            <!-- Hull - sleek -->
            <path d="M 4,${h / 2} L 10,${h / 2 - 8} L ${w - 8},${h / 2 - 8} Q ${w - 2},${h / 2 - 4} ${w - 2},${h / 2} Q ${w - 2},${h / 2 + 4} ${w - 8},${h / 2 + 8} L 10,${h / 2 + 8} Z" fill="#5a6b4a" stroke="#3a4b2a" stroke-width="1.5"/>
            <!-- Superstructure -->
            <rect x="${w / 2 - 12}" y="${h / 2 - 5}" width="24" height="10" rx="2" fill="#4a5b3a" stroke="#3a4b2a" stroke-width="1"/>
            <!-- Forward turret -->
            <circle cx="22" cy="${h / 2}" r="5" fill="#4a5b3a" stroke="#3a4b2a" stroke-width="1"/>
            <line x1="22" y1="${h / 2}" x2="10" y2="${h / 2}" stroke="#3a4b2a" stroke-width="2" stroke-linecap="round"/>
            <!-- Aft turret -->
            <circle cx="${w - 22}" cy="${h / 2}" r="4" fill="#4a5b3a" stroke="#3a4b2a" stroke-width="1"/>
            <line x1="${w - 22}" y1="${h / 2}" x2="${w - 12}" y2="${h / 2}" stroke="#3a4b2a" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Bow point -->
            <polygon points="4,${h / 2} 10,${h / 2 - 5} 10,${h / 2 + 5}" fill="#5a6b4a"/>
        </svg>`;
  },

  Submarine(w, h) {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
            <!-- Hull - rounded -->
            <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 3}" ry="${h / 2 - 6}" fill="#2a2a2a" stroke="#1a1a1a" stroke-width="1.5"/>
            <!-- Conning tower -->
            <rect x="${w / 2 - 10}" y="${h / 2 - 8}" width="20" height="16" rx="4" fill="#333" stroke="#1a1a1a" stroke-width="1"/>
            <!-- Periscope -->
            <line x1="${w / 2 + 4}" y1="${h / 2 - 8}" x2="${w / 2 + 4}" y2="${h / 2 - 14}" stroke="#444" stroke-width="2" stroke-linecap="round"/>
            <circle cx="${w / 2 + 4}" cy="${h / 2 - 15}" r="2" fill="#555" stroke="#333" stroke-width="0.5"/>
            <!-- Bow -->
            <ellipse cx="8" cy="${h / 2}" rx="5" ry="${h / 2 - 8}" fill="#252525"/>
            <!-- Stern planes -->
            <line x1="${w - 8}" y1="${h / 2 - 10}" x2="${w - 8}" y2="${h / 2 + 10}" stroke="#333" stroke-width="2"/>
            <!-- Propeller hint -->
            <circle cx="${w - 5}" cy="${h / 2}" r="3" fill="none" stroke="#444" stroke-width="1"/>
            <!-- Hull details -->
            <line x1="18" y1="${h / 2}" x2="${w / 2 - 12}" y2="${h / 2}" stroke="#333" stroke-width="0.8"/>
            <line x1="${w / 2 + 12}" y1="${h / 2}" x2="${w - 18}" y2="${h / 2}" stroke="#333" stroke-width="0.8"/>
        </svg>`;
  },

  PatrolBoat(w, h) {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
            <!-- Hull - small and fast -->
            <path d="M 4,${h / 2} L 8,${h / 2 - 7} L ${w - 6},${h / 2 - 7} Q ${w - 2},${h / 2 - 3} ${w - 2},${h / 2} Q ${w - 2},${h / 2 + 3} ${w - 6},${h / 2 + 7} L 8,${h / 2 + 7} Z" fill="#d4cfc4" stroke="#aaa48e" stroke-width="1.5"/>
            <!-- Cabin -->
            <rect x="${w / 2 - 8}" y="${h / 2 - 5}" width="16" height="10" rx="2" fill="#c4bfb4" stroke="#aaa48e" stroke-width="1"/>
            <!-- Small gun -->
            <circle cx="16" cy="${h / 2}" r="3" fill="#b4afa4" stroke="#aaa48e" stroke-width="0.8"/>
            <line x1="16" y1="${h / 2}" x2="8" y2="${h / 2}" stroke="#aaa48e" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Bow -->
            <polygon points="4,${h / 2} 8,${h / 2 - 4} 8,${h / 2 + 4}" fill="#d4cfc4"/>
            <!-- Wake lines -->
            <line x1="${w - 4}" y1="${h / 2 - 4}" x2="${w + 2}" y2="${h / 2 - 6}" stroke="#aaa48e" stroke-width="0.5" opacity="0.5"/>
            <line x1="${w - 4}" y1="${h / 2 + 4}" x2="${w + 2}" y2="${h / 2 + 6}" stroke="#aaa48e" stroke-width="0.5" opacity="0.5"/>
        </svg>`;
  },
};

function getSvg(shipName, size, _orientation) {
  const w = size * CELL_SIZE;
  const h = CELL_SIZE;
  const template = svgTemplates[shipName];
  if (!template) return '';
  return template(w, h);
}

export { getSvg, CELL_SIZE };
