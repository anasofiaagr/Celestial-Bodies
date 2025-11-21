/**
 * Chart Data Mapper - Example utility for mapping astrology API responses
 * 
 * This utility shows how to transform data from various astrology APIs
 * into the format needed for interpretation generation.
 * 
 * USAGE EXAMPLE:
 * 
 * 1. Fetch chart data from an astrology API (e.g., Astro-Seek, AstroAPI)
 * 2. Transform the response using these mapper functions
 * 3. Pass to interpretationGenerator to create personalized text
 * 
 * Example API response structure (varies by provider):
 * {
 *   planets: [
 *     { name: "Sun", sign: "Aries", house: 1, degree: 10.5 },
 *     { name: "Moon", sign: "Gemini", house: 3, degree: 25.3 },
 *     ...
 *   ],
 *   aspects: [
 *     { type: "Trine", planet1: "Sun", planet2: "Mars", angle: 120, orb: 2 },
 *     ...
 *   ]
 * }
 */

interface APIChartData {
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree?: number;
    retrograde?: boolean;
  }>;
  aspects?: Array<{
    type: string;
    planet1: string;
    planet2: string;
    angle?: number;
    orb?: number;
  }>;
}

interface ChartData {
  planets: Array<{
    name: string;
    sign: string;
    house: number;
  }>;
}

interface AspectData {
  type: string;
  planet1: string;
  planet2: string;
}

/**
 * Maps API response to our internal chart data format
 */
export function mapAPIResponseToChartData(apiData: APIChartData): ChartData {
  return {
    planets: apiData.planets.map((p) => ({
      name: p.name,
      sign: p.sign,
      house: p.house,
    })),
  };
}

/**
 * Extracts detected aspects from API response
 */
export function extractAspects(apiData: APIChartData): AspectData[] {
  if (!apiData.aspects) return [];
  
  return apiData.aspects.map((a) => ({
    type: a.type,
    planet1: a.planet1,
    planet2: a.planet2,
  }));
}

/**
 * Example: Generate mock chart data for testing
 * In production, replace this with actual API calls
 */
export function generateMockChartData(): APIChartData {
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const planetNames = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ];

  return {
    planets: planetNames.map((name, index) => ({
      name,
      sign: zodiacSigns[index % 12],
      house: (index % 12) + 1,
      degree: Math.random() * 30,
      retrograde: Math.random() > 0.8,
    })),
    aspects: [
      { type: 'Trine', planet1: 'Sun', planet2: 'Mars', angle: 120, orb: 2 },
      { type: 'Sextile', planet1: 'Venus', planet2: 'Jupiter', angle: 60, orb: 3 },
      { type: 'Square', planet1: 'Saturn', planet2: 'Pluto', angle: 90, orb: 5 },
      { type: 'Opposition', planet1: 'Moon', planet2: 'Saturn', angle: 180, orb: 4 },
      { type: 'Conjunction', planet1: 'Sun', planet2: 'Mercury', angle: 0, orb: 3 },
    ],
  };
}

/**
 * INTEGRATION GUIDE:
 * 
 * To connect a real astrology API:
 * 
 * 1. Install your API client library (e.g., axios)
 * 2. Create an API service function:
 * 
 *    async function fetchChartData(birthData: BirthData): Promise<APIChartData> {
 *      const response = await axios.post('https://api.astro-service.com/chart', {
 *        date: birthData.date,
 *        time: birthData.time,
 *        location: birthData.location,
 *      });
 *      return response.data;
 *    }
 * 
 * 3. Use in your component:
 * 
 *    const apiData = await fetchChartData(userBirthData);
 *    const chartData = mapAPIResponseToChartData(apiData);
 *    const aspects = extractAspects(apiData);
 *    const interpretations = interpretationGenerator.generateAllPlanetInterpretations(chartData);
 * 
 * Popular Astrology APIs:
 * - Astro-Seek API: https://www.astro-seek.com/
 * - Astrodienst Swiss Ephemeris: https://www.astro.com/swisseph/
 * - AstroAPI: https://astroapi.com/
 */
