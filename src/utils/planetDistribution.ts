// Shared planet distribution logic to ensure consistency between Spiral and text overlays

const TOTAL_LAYERS = 12;
const TOTAL_PLANETS = 10;

export const PLANET_NAMES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

// Generate a consistent planet distribution using a seeded random
// This ensures the same distribution is used everywhere
let cachedDistribution: Record<number, number[]> | null = null;

export function getPlanetDistribution(): Record<number, number[]> {
  if (cachedDistribution) {
    return cachedDistribution;
  }

  const layerAssignments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  
  // Use a seeded shuffle for consistency
  // Simple linear congruential generator for seeded random
  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // Fisher-Yates shuffle with seeded random
  const shuffled = [...layerAssignments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  const selectedLayers = shuffled.slice(0, TOTAL_PLANETS);
  
  const mapping: Record<number, number[]> = {};
  for (let i = 0; i < TOTAL_LAYERS; i++) {
    mapping[i] = [];
  }
  
  selectedLayers.forEach((layer, planetIndex) => {
    mapping[layer].push(planetIndex);
  });
  
  cachedDistribution = mapping;
  return mapping;
}

// Get planet names for a specific layer
export function getPlanetsInLayer(layerIndex: number): string[] {
  const distribution = getPlanetDistribution();
  const planetIndices = distribution[layerIndex] || [];
  return planetIndices.map(idx => PLANET_NAMES[idx]);
}

// Get all layers with their planets
export function getLayerPlanetsMap(): Record<number, string[]> {
  const distribution = getPlanetDistribution();
  const map: Record<number, string[]> = {};
  
  for (let layer = 0; layer < TOTAL_LAYERS; layer++) {
    map[layer] = getPlanetsInLayer(layer);
  }
  
  return map;
}