// ChartEnricher.ts
// Normalizes API data and enriches it with local dataset information

import type { AstroSubject, ApiPlanet, ApiHouse, ApiAspect, BirthChartResponse } from "./AstrologyApiClient";
import type { FluidPlanet, FluidSign, FluidHouse, AspectLibraryEntry } from "./AstroDataRegistry";
import { findPlanetByName, findSignByName, findHouseById, findAspectLibraryEntry } from "./AstroDataRegistry";

export type EnrichedPlanet = {
  api: ApiPlanet;
  planet: FluidPlanet;
  sign: FluidSign;
  house: FluidHouse;
};

export type EnrichedHouse = {
  api: ApiHouse;
  fluid: FluidHouse;
  id: number;
  sign: string;
  cusp_degree: number;
};

export type EnrichedAspect = {
  api: ApiAspect;
  from: EnrichedPlanet;
  to: EnrichedPlanet;
  library?: AspectLibraryEntry;
};

export type ChartSummary = {
  dominant_element: string;
  dominant_element_phrase: string;
  dominant_mode: string;
  dominant_mode_phrase: string;
  primary_cluster_house: {
    name: string;
    essence: string;
    keywords: string[];
  };
  signature_planet: {
    name: string;
    archetype_figure_name: string;
    archetype_name: string;
    essence: string;
  };
  signature_sign: {
    name: string;
    archetype_name: string;
    expressions: string[];
  };
  aspect_mood: string;
  aspect_keywords: string[];
};

export type EnrichedChart = {
  subject: AstroSubject;
  planets: EnrichedPlanet[];
  houses: EnrichedHouse[];
  aspects: EnrichedAspect[];
  chartSummary?: ChartSummary;
};

/**
 * Enriches the raw API birth chart response with data from the local integrated dataset
 * @param apiChart - Raw response from the Astrologer API
 * @param subject - The birth data subject
 * @returns EnrichedChart with all matched data
 */
export function enrichBirthChart(
  apiChart: BirthChartResponse,
  subject: AstroSubject
): EnrichedChart {
  // Enrich planets
  const enrichedPlanets: EnrichedPlanet[] = apiChart.planets
    .map((apiPlanet) => {
      const planet = findPlanetByName(apiPlanet.name);
      const sign = findSignByName(apiPlanet.sign);
      const house = findHouseById(apiPlanet.house_id);

      if (!planet) {
        console.warn(`Planet not found in dataset: ${apiPlanet.name}`);
        return null;
      }
      if (!sign) {
        console.warn(`Sign not found in dataset: ${apiPlanet.sign}`);
        return null;
      }
      if (!house) {
        console.warn(`House not found in dataset: ${apiPlanet.house_id}`);
        return null;
      }

      return {
        api: apiPlanet,
        planet,
        sign,
        house,
      };
    })
    .filter((p): p is EnrichedPlanet => p !== null);

  // Enrich houses - keep all 12 houses
  const enrichedHouses: EnrichedHouse[] = apiChart.houses
    .map((apiHouse) => {
      const fluidHouse = findHouseById(apiHouse.id);
      if (!fluidHouse) {
        console.warn(`House not found in dataset: ${apiHouse.id}`);
        return null;
      }

      return {
        api: apiHouse,
        fluid: fluidHouse,
        id: apiHouse.id,
        sign: apiHouse.sign,
        cusp_degree: apiHouse.cusp_degree,
      };
    })
    .filter((h): h is EnrichedHouse => h !== null);

  // Enrich aspects
  const enrichedAspects: EnrichedAspect[] = (apiChart.aspects || [])
    .map((apiAspect) => {
      // Add null checks before toLowerCase
      if (!apiAspect.p1_name || !apiAspect.p2_name) {
        console.warn('Aspect missing planet names:', apiAspect);
        return null;
      }

      const fromPlanet = enrichedPlanets.find(
        (p) => p.planet.name.toLowerCase() === apiAspect.p1_name.toLowerCase()
      );
      const toPlanet = enrichedPlanets.find(
        (p) => p.planet.name.toLowerCase() === apiAspect.p2_name.toLowerCase()
      );

      // Silently filter out aspects with unsupported planets/points
      // (Mean_Node, Chiron, Mean_Lilith, Ascendant, Medium_Coeli, Mean_South_Node)
      if (!fromPlanet || !toPlanet) {
        return null;
      }

      const library = findAspectLibraryEntry(apiAspect.type);

      return {
        api: apiAspect,
        from: fromPlanet,
        to: toPlanet,
        library,
      };
    })
    .filter((a): a is EnrichedAspect => a !== null);

  return {
    subject,
    planets: enrichedPlanets,
    houses: enrichedHouses,
    aspects: enrichedAspects,
    chartSummary: calculateChartSummary(enrichedPlanets, enrichedHouses, enrichedAspects),
  };
}

/**
 * Calculate chart summary statistics
 */
function calculateChartSummary(
  planets: EnrichedPlanet[],
  houses: EnrichedHouse[],
  aspects: EnrichedAspect[]
): ChartSummary {
  // Calculate dominant element (Fire, Earth, Air, Water)
  const elementCounts: Record<string, number> = {};
  planets.forEach((p) => {
    const element = p.sign.element || 'Fire';
    elementCounts[element] = (elementCounts[element] || 0) + 1;
  });
  
  const dominantElement = Object.keys(elementCounts).reduce((a, b) =>
    elementCounts[a] > elementCounts[b] ? a : b
  );

  const elementPhrases: Record<string, string> = {
    Fire: 'quick sparks, heat, impulse',
    Earth: 'slow growth, matter, form',
    Air: 'flow, thought, connection',
    Water: 'depth, feeling, intuition',
  };

  // Calculate dominant mode (Cardinal, Fixed, Mutable)
  const modeCounts: Record<string, number> = {};
  planets.forEach((p) => {
    const mode = p.sign.mode || 'Cardinal';
    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
  });
  
  const dominantMode = Object.keys(modeCounts).reduce((a, b) =>
    modeCounts[a] > modeCounts[b] ? a : b
  );

  const modePhrases: Record<string, string> = {
    Cardinal: 'initiating new patterns',
    Fixed: 'sustaining what matters',
    Mutable: 'adapting through change',
  };

  // Find primary cluster house (house with most planets)
  const houseCounts: Record<number, number> = {};
  planets.forEach((p) => {
    const houseId = p.api.house_id;
    houseCounts[houseId] = (houseCounts[houseId] || 0) + 1;
  });
  
  const primaryClusterHouseId = parseInt(
    Object.keys(houseCounts).reduce((a, b) =>
      houseCounts[parseInt(a)] > houseCounts[parseInt(b)] ? a : b
    )
  );
  
  const primaryClusterHouse = houses.find((h) => h.id === primaryClusterHouseId);

  // Find signature planet (Sun or most aspected planet)
  const signaturePlanet = planets.find((p) => p.planet.name === 'Sun') || planets[0];

  // Calculate aspect mood
  const harmonicCount = aspects.filter((a) =>
    ['Trine', 'Sextile', 'Conjunction'].includes(a.api.type)
  ).length;
  const tensionCount = aspects.filter((a) =>
    ['Square', 'Opposition'].includes(a.api.type)
  ).length;

  let aspectMood = 'balanced';
  let aspectKeywords = ['flow', 'integration'];
  
  if (harmonicCount > tensionCount * 1.5) {
    aspectMood = 'harmonious';
    aspectKeywords = ['flow', 'ease', 'grace'];
  } else if (tensionCount > harmonicCount * 1.5) {
    aspectMood = 'dynamic';
    aspectKeywords = ['tension', 'growth', 'activation'];
  }

  return {
    dominant_element: dominantElement,
    dominant_element_phrase: elementPhrases[dominantElement],
    dominant_mode: dominantMode,
    dominant_mode_phrase: modePhrases[dominantMode],
    primary_cluster_house: {
      name: primaryClusterHouse?.fluid.name || 'House of Emergence',
      essence: primaryClusterHouse?.fluid.essence || 'self, emergence',
      keywords: primaryClusterHouse?.fluid.keywords || ['identity', 'self'],
    },
    signature_planet: {
      name: signaturePlanet.planet.name,
      archetype_figure_name: signaturePlanet.planet.archetype_figure_name || signaturePlanet.planet.name,
      archetype_name: signaturePlanet.planet.archetype_name || 'Core Self',
      essence: signaturePlanet.planet.essence || 'vitality',
    },
    signature_sign: {
      name: signaturePlanet.sign.name,
      archetype_name: signaturePlanet.sign.archetype_name || signaturePlanet.sign.fusion_label || signaturePlanet.sign.name,
      expressions: signaturePlanet.sign.expressions || [],
    },
    aspect_mood: aspectMood,
    aspect_keywords: aspectKeywords,
  };
}

/**
 * Helper to get planet position on the spiral based on house and degree
 */
export function getPlanetSpiralPosition(
  enrichedPlanet: EnrichedPlanet,
  spiralRadius: number = 5,
  spiralHeight: number = 12
): [number, number, number] {
  const { api } = enrichedPlanet;
  
  // Each house spans 30 degrees (360 / 12)
  // House 1 starts at 0°, House 2 at 30°, etc.
  const houseBaseAngle = (api.house_id - 1) * 30;
  
  // Add the planet's degree within the sign (0-30)
  // Note: api.degree is the absolute degree position
  const absoluteDegree = api.degree;
  
  // Convert to radians
  const angle = (absoluteDegree * Math.PI) / 180;
  
  // Calculate spiral position
  const x = Math.cos(angle) * spiralRadius;
  const z = Math.sin(angle) * spiralRadius;
  
  // Y position based on house (0-11 mapped to height)
  const y = ((api.house_id - 1) / 12) * spiralHeight - spiralHeight / 2;
  
  return [x, y, z];
}

/**
 * Helper to get house layer Y position
 */
export function getHouseLayerY(houseNumber: number, totalHeight: number = 12): number {
  return ((houseNumber - 1) / 12) * totalHeight - totalHeight / 2;
}