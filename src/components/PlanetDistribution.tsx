// Shared planet distribution logic for Spiral and SpiralVisualization
// Ensures 10 planets are consistently distributed across 12 houses

export const PLANET_NAMES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

// Returns a mapping of layer index to array of planet indices
export function getPlanetDistribution(): Record<number, number[]> {
  // Distribute 10 planets across 12 houses
  // Some houses will have 0 planets, some will have 1, and some will have 2
  return {
    0: [0],      // House 1: Sun
    1: [1],      // House 2: Moon
    2: [2],      // House 3: Mercury
    3: [3],      // House 4: Venus
    4: [4],      // House 5: Mars
    5: [5],      // House 6: Jupiter
    6: [],       // House 7: Empty
    7: [6, 7],   // House 8: Saturn, Uranus
    8: [],       // House 9: Empty
    9: [8],      // House 10: Neptune
    10: [9],     // House 11: Pluto
    11: [],      // House 12: Empty
  };
}
