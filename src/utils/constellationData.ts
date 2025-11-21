// Shared constellation data generation for Constellation View and Artifact Download

export interface Aspect {
  planetA: string;
  planetB: string;
  type: 'Conjunction' | 'Opposition' | 'Square' | 'Trine' | 'Sextile';
  strength: number;
  orb: number;
  color: string;
}

// Aspect styles from the dataset
const ASPECT_STYLES = {
  Conjunction: { color: '#FFD166' },
  Opposition: { color: '#EF476F' },
  Square: { color: '#06D6A0' },
  Trine: { color: '#118AB2' },
  Sextile: { color: '#8338EC' },
};

// Calculate planet positions in 3D space
export function calculatePlanetPositions(
  planets: string[],
  aspects: Aspect[]
): Record<string, [number, number, number]> {
  const positions: Record<string, [number, number, number]> = {};
  const radius = 12;
  const angleStep = (Math.PI * 2) / planets.length;

  planets.forEach((planet, i) => {
    const angle = i * angleStep;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 4; // Random height variation

    positions[planet] = [x, y, z];
  });

  return positions;
}

// Generate constellation data (same as in ConstellationView)
export function generateConstellationData() {
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  
  // Generate aspects between planets
  const aspects: Aspect[] = [
    { planetA: 'Sun', planetB: 'Mars', type: 'Trine', strength: 0.85, orb: 2.5, color: ASPECT_STYLES.Trine.color },
    { planetA: 'Venus', planetB: 'Jupiter', type: 'Sextile', strength: 0.72, orb: 3.2, color: ASPECT_STYLES.Sextile.color },
    { planetA: 'Saturn', planetB: 'Pluto', type: 'Square', strength: 0.91, orb: 1.8, color: ASPECT_STYLES.Square.color },
    { planetA: 'Moon', planetB: 'Saturn', type: 'Opposition', strength: 0.78, orb: 2.1, color: ASPECT_STYLES.Opposition.color },
    { planetA: 'Sun', planetB: 'Mercury', type: 'Conjunction', strength: 0.95, orb: 0.5, color: ASPECT_STYLES.Conjunction.color },
    { planetA: 'Venus', planetB: 'Neptune', type: 'Trine', strength: 0.68, orb: 4.2, color: ASPECT_STYLES.Trine.color },
    { planetA: 'Mars', planetB: 'Uranus', type: 'Square', strength: 0.82, orb: 2.8, color: ASPECT_STYLES.Square.color },
    { planetA: 'Jupiter', planetB: 'Neptune', type: 'Sextile', strength: 0.65, orb: 3.9, color: ASPECT_STYLES.Sextile.color },
    { planetA: 'Mercury', planetB: 'Uranus', type: 'Trine', strength: 0.71, orb: 3.5, color: ASPECT_STYLES.Trine.color },
    { planetA: 'Moon', planetB: 'Pluto', type: 'Square', strength: 0.76, orb: 2.9, color: ASPECT_STYLES.Square.color },
  ];

  // Position planets in 3D space based on aspect geometry
  const planetPositions = calculatePlanetPositions(planets, aspects);

  return { planets, aspects, planetPositions };
}
