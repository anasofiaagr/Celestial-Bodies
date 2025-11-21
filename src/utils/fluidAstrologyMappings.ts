// Fluid Astrology Conceptual Mappings
// These alias bindings map the original data fields to their new conceptual labels

// Import dataset from TypeScript module
import integratedDataset from '../data/newest_integrated_dataset';
import type { EnrichedChart } from './ChartEnricher';

const dataset = integratedDataset;

// Fallback data for immediate use (will be replaced by real data)
const FALLBACK_HOUSE_NAMES = [
  'House of Emergence & Self-Projection',
  'House of Grounding & Material Flow',
  'House of Mental Curiosity & Communication',
  'House of Inner Rooting & Emotional Foundation',
  'House of Expressive Joy & Inner Child',
  'House of Purposeful Work & Craft',
  'House of Relational Harmony & Partnership',
  'House of Deep Transformation & Shared Resources',
  'House of Expansive Wisdom & Philosophy',
  'House of Mastery & Public Achievement',
  'House of Collective Vision & Innovation',
  'House of Spiritual Dissolving & Compassion'
];
// redoing these
// const FALLBACK_FUSION_LABELS = [
//   'Fire of Beginning',
//   'Body of Soil',
//   'Breath of Stories',
//   'Shell of Waters',
//   'Heart of Radiance',
//   'Loom of Precision',
//   'Scale of Mirrors',
//   'Veil of Depths',
//   'Arrow of Seeking',
//   'Mountain of Time',
//   'Well of Currents',
//   'Ocean of Dreaming'
// ];

const FALLBACK_PLANET_ARCHETYPES: Record<string, string> = {
  'Sun': 'The Hero planet',
  'Moon': 'The Mother planet',
  'Mercury': 'The Messenger planet',
  'Venus': 'The Lover planet',
  'Mars': 'The Warrior planet',
  'Jupiter': 'The Teacher planet',
  'Saturn': 'The Elder planet',
  'Uranus': 'The Awakener planet',
  'Neptune': 'The Mystic planet',
  'Pluto': 'The Alchemist planet'
};

// Get house name (main label for House Layer View)
export function getHouseName(houseIndex: number): string {
  if (dataset?.houses?.[houseIndex]) {
    return dataset.houses[houseIndex].name;
  }
  return FALLBACK_HOUSE_NAMES[houseIndex] || `House ${houseIndex + 1}`;
}

// Get house essence and keywords for hover tooltip
export function getHouseTooltipData(houseIndex: number) {
  const house = dataset?.houses?.[houseIndex];
  return {
    title: "House Field (formerly Sign Placement)",
    essence: house?.essence || 'self, emergence',
    keywords: house?.keywords || ['identity', 'self', 'beginnings'],
    note: "*In Fluid Astrology, names shift shape to honor their archetypal origins rather than fixed astrology terms.*"
  };
}

// Get planet archetype figure name (replaces standard planet name)
export function getPlanetArchetypeName(planetName: string): string {
  if (dataset?.planets) {
    const planet = dataset.planets.find((p: any) => p.name === planetName);
    if (planet?.archetype_figure_name) {
      return planet.archetype_figure_name;
    }
  }
  return FALLBACK_PLANET_ARCHETYPES[planetName] || planetName;
}

// Get planet tooltip data for hover
export function getPlanetTooltipData(planetName: string) {
  const planet = dataset?.planets?.find((p: any) => p.name === planetName);
  return {
    title: "Archetypal Figure (Planet Expression)",
    archetypeName: planet?.archetype_name || 'Core Self & Vital Expression',
    essence: planet?.essence || 'vitality, core self',
    note: "*In Fluid Astrology, names shift shape to honor their archetypal origins rather than fixed astrology terms.*"
  };
}

// Get fusion label (derived from sign name) for display under 3D sign figure
export function getFusionLabel(houseIndex: number, enrichedChart?: EnrichedChart | null): string {
  // First, try to get the actual sign from the enriched chart
  let actualSignName: string | null = null;
  if (enrichedChart?.houses?.[houseIndex]) {
    actualSignName = enrichedChart.houses[houseIndex].sign;
  }
  
  // If we have an actual sign from the chart, find its fusion label
  if (actualSignName && dataset?.signs) {
    const sign = dataset.signs.find((s: any) => s.name === actualSignName);
    if (sign?.fusion_label) {
      return sign.fusion_label;
    }
  }
  
  // Fallback to traditional house=sign mapping
  if (dataset?.houses?.[houseIndex] && dataset?.signs) {
    const house = dataset.houses[houseIndex];
    const signName = house.associated_sign?.name || '';
    const sign = dataset.signs.find((s: any) => s.name === signName);
    if (sign?.fusion_label) {
      return sign.fusion_label;
    }
  }
  
  return FALLBACK_FUSION_LABELS[houseIndex] || 'Fusion Label';
}

// Get fusion label tooltip data
export function getFusionLabelTooltipData(houseIndex: number, enrichedChart?: EnrichedChart | null) {
  // Try to get actual sign from enriched chart first
  let signName: string;
  if (enrichedChart?.houses?.[houseIndex]) {
    signName = enrichedChart.houses[houseIndex].sign;
  } else {
    const house = dataset?.houses?.[houseIndex];
    const fallbackSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    signName = house?.associated_sign?.name || fallbackSigns[houseIndex];
  }
  
  return {
    title: "Fusion Label (formerly Zodiac Sign)",
    description: "This represents the blending of the house and planet qualities filtered through what was once the sign.",
    signName: signName,
    note: "*In Fluid Astrology, names shift shape to honor their archetypal origins rather than fixed astrology terms.*"
  };
}

// Get sign name (original) for internal use
export function getSignName(houseIndex: number, enrichedChart?: EnrichedChart | null): string {
  // Try enriched chart first
  if (enrichedChart?.houses?.[houseIndex]) {
    return enrichedChart.houses[houseIndex].sign;
  }
  
  // Fallback to traditional mapping
  const house = dataset?.houses?.[houseIndex];
  const fallbackSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return house?.associated_sign?.name || fallbackSigns[houseIndex];
}

// Get sign glyph
export function getSignGlyph(houseIndex: number): string {
  const house = dataset?.houses?.[houseIndex];
  const fallbackGlyphs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  return house?.associated_sign?.glyph || fallbackGlyphs[houseIndex];
}

// Get house color
export function getHouseColor(houseIndex: number): string {
  const house = dataset?.houses?.[houseIndex];
  const fallbackColors = [
    '#F94144', '#F3722C', '#F8961E', '#F9C74F',
    '#90BE6D', '#43AA8B', '#577590', '#277DA1',
    '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'
  ];
  return house?.color || fallbackColors[houseIndex];
}