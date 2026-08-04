export interface AreaGrid {
  id: string
  name: string
  color: string
  terrainColor: string
  desc: string
  encounters: boolean
  grid: string[][]
}

// World maps are inflated by this factor for a significantly larger play area.
// Set to 1 to keep the original compact size.
export const MAP_SCALE = 2;

// Scale a uniform grid by integer factor, preserving the terrain layout.
export function scaleGrid<T>(grid: T[][], factor: number): T[][] {
  const out: T[][] = [];
  for (const row of grid) {
    for (let k = 0; k < factor; k++) {
      const newRow: T[] = [];
      for (const cell of row) {
        for (let c = 0; c < factor; c++) newRow.push(cell);
      }
      out.push(newRow);
    }
  }
  return out;
}

export const AREAS_DATA: AreaGrid[] = [
  {
    id: 'route1', name: 'Route 1', desc: 'Tall grass and wild Pokémon',
    color: '#4ade80', terrainColor: '#166534', encounters: true,
    grid: [
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','F','F','D','D','D','D','F','F','G','G','G'],
      ['G','G','F','F','D','D','D','D','F','F','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','F','F','F','F','F','F','F','F','G','G','G'],
      ['G','G','P','P','P','P','P','P','P','P','G','G','G'],
      ['G','G','P','P','P','P','P','P','P','P','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ],
  },
  {
    id: 'route2', name: 'Route 2', desc: 'Hills and hidden paths',
    color: '#22c55e', terrainColor: '#14532d', encounters: true,
    grid: [
      ['G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','F','F','F','D','D','F','F','F','F','G','G'],
      ['G','G','G','D','D','D','D','G','G','G','G','G'],
      ['G','G','G','D','D','D','D','G','G','G','G','G'],
      ['G','F','F','F','D','D','F','F','F','F','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','F','F','F','G','G','F','F','F','F','G','G'],
      ['G','G','G','G','B','B','G','G','G','G','G','G'],
      ['G','G','G','G','B','B','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G'],
    ],
  },
  {
    id: 'forest', name: 'Viridian Forest', desc: 'Dark and mysterious',
    color: '#16a34a', terrainColor: '#14532d', encounters: true,
    grid: [
      ['T','T','T','T','T','T','T','T','T','T'],
      ['T','T','T','T','T','T','T','T','T','T'],
      ['T','F','F','D','D','D','D','F','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','D','D','D','D','D','D','F','T'],
      ['T','F','F','D','D','D','D','F','F','T'],
      ['T','T','T','T','T','T','T','T','T','T'],
      ['T','T','T','T','T','T','T','T','T','T'],
    ],
  },
  {
    id: 'cave', name: 'Diglett Cave', desc: 'Dark tunnels underground',
    color: '#a8734a', terrainColor: '#57534e', encounters: true,
    grid: [
      ['R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R'],
      ['R','S','S','D','D','D','D','S','S','R'],
      ['R','S','D','D','D','D','D','D','S','R'],
      ['R','S','D','R','D','D','R','D','S','R'],
      ['R','S','D','R','D','D','R','D','S','R'],
      ['R','S','S','D','D','D','D','S','S','R'],
      ['R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R'],
    ],
  },
  {
    id: 'water', name: 'Cerulean Bay', desc: 'Sparkling waters',
    color: '#3b82f6', terrainColor: '#1e3a8a', encounters: true,
    grid: [
      ['S','S','S','S','S','S','S','S','S','S'],
      ['S','S','S','S','S','S','S','S','S','S'],
      ['S','W','W','W','W','W','W','W','W','S'],
      ['S','W','D','D','D','D','D','D','W','S'],
      ['S','W','D','D','D','D','D','D','W','S'],
      ['S','W','W','W','D','D','W','W','W','S'],
      ['S','W','W','W','D','D','W','W','W','S'],
      ['S','W','W','W','W','W','W','W','W','S'],
      ['S','S','S','S','S','S','S','S','S','S'],
      ['S','S','S','S','S','S','S','S','S','S'],
    ],
  },
  {
    id: 'mountain', name: 'Mt. Silver', desc: 'Towering rocky peak',
    color: '#92400e', terrainColor: '#44403c', encounters: true,
    grid: [
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','M','M','R','R','R','R','M','M','R','R','R'],
      ['R','M','D','D','R','R','D','D','M','R','R','R'],
      ['R','R','D','D','D','D','D','D','R','R','R','R'],
      ['R','R','D','D','D','D','D','D','R','R','R','R'],
      ['R','M','D','D','R','R','D','D','M','R','R','R'],
      ['R','M','M','R','R','R','R','M','M','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R'],
    ],
  },
  {
    id: 'beach', name: 'Cyan Beach', desc: 'Sandy shores',
    color: '#eab308', terrainColor: '#a16207', encounters: true,
    grid: [
      ['S','S','S','S','S','S','S','S','S','S','S'],
      ['S','B','B','B','W','W','B','B','B','S','S'],
      ['S','B','B','B','W','W','B','B','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','D','D','B','B','D','D','B','S','S'],
      ['S','B','B','B','B','B','B','B','B','S','S'],
      ['S','S','S','S','S','S','S','S','S','S','S'],
      ['S','S','S','S','S','S','S','S','S','S','S'],
    ],
  },
  {
    id: 'city', name: 'Pallet Town', desc: 'A quiet town by the sea',
    color: '#94a3b8', terrainColor: '#44403c', encounters: false,
    grid: [
      ['P','P','P','P','P','P','P','P','P','P','P'],
      ['P','P','H','H','P','H','H','P','P','P','P'],
      ['P','P','H','H','P','H','H','P','P','P','P'],
      ['P','P','P','P','G','P','P','P','P','P','P'],
      ['P','P','P','P','G','P','P','P','P','P','P'],
      ['P','P','G','G','P','G','G','P','P','P','P'],
      ['P','P','G','G','P','G','G','P','P','P','P'],
      ['P','P','P','P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P','P','P','P'],
    ],
  },
  {
    id: 'gym', name: 'Indigo League', desc: 'Battle Gym Leaders!',
    color: '#f59e0b', terrainColor: '#1c1917', encounters: false,
    grid: [
      ['B','B','B','B','B','B','B','B','B'],
      ['B','B','B','B','B','B','B','B','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','Y','Y','R','R','R','Y','Y','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','Y','Y','Y','Y','Y','Y','Y','B'],
      ['B','B','B','B','B','B','B','B','B'],
      ['B','B','B','B','B','B','B','B','B'],
    ],
  },
]