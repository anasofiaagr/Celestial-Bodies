// SentenceEngine.ts
// Core sentence generation system with JSON templates and variable resolution

import { spiralTemplates } from './spiralTemplates';
import { planetTemplates } from './planetTemplates';
import { houseTemplates } from './houseTemplates';
import { constellationTemplates } from './constellationTemplates';
import { evolvingTemplates } from './evolvingTemplates';
import integratedDataset from '../data/newest_integrated_dataset';
import { PLACEHOLDER_SCHEMA } from './hoverSchemaData';

// Types
export type SentenceContext = 
  | 'spiral_overview' 
  | 'planet_focus' 
  | 'house_focus' 
  | 'constellation_view'
  | 'constellation_aspect'
  | 'evolving_view';

export interface Template {
  id: string;
  context: SentenceContext;
  role?: 'primary' | 'cue';
  weights: number;
  text: string;
  variables: string[];
}

export interface HoverData {
  title: string;
  summary: string;
  fallback: string;
}

export interface TokenData {
  text: string;
  isVariable: boolean;
  variablePath?: string;
  hoverData?: HoverData;
  color?: string;
}

export interface SentencePayload {
  planet?: any;
  house?: any;
  sign?: any;
  aspect?: any;
  chart?: any;
  planetsInHouse?: any[];
  enrichedChart?: any;
}

// Consolidate all templates
const ALL_TEMPLATES: Template[] = [
  ...spiralTemplates,
  ...planetTemplates,
  ...houseTemplates,
  ...constellationTemplates,
  ...evolvingTemplates
];

/**
 * Resolve a variable path from the data payload
 */
function resolveVariable(variablePath: string, payload: SentencePayload): string {
  try {
    // Get schema definition for this variable
    const schema = PLACEHOLDER_SCHEMA[variablePath as keyof typeof PLACEHOLDER_SCHEMA];
    if (!schema) {
      console.warn(`No schema found for variable: ${variablePath}`);
      return '—';
    }

    // Handle special array index notation like [0]
    const dataPath = schema.path;
    
    // Simple path resolution
    let value: any = null;
    
    // Handle chart.* paths
    if (dataPath.startsWith('chart_summary.')) {
      const key = dataPath.replace('chart_summary.', '');
      
      // Handle array index notation like aspect_keywords[0]
      if (key.includes('[')) {
        const match = key.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const arrayName = match[1];
          const index = parseInt(match[2]);
          value = payload.chart?.[arrayName]?.[index];
        }
      } else {
        value = payload.chart?.[key];
        
        // Handle nested paths like signature_planet.archetype_figure_name
        if (!value && key.includes('.')) {
          const parts = key.split('.');
          value = payload.chart?.[parts[0]]?.[parts[1]];
        }
      }
    }
    // Handle planets[] paths
    else if (dataPath.startsWith('planets[].')) {
      const key = dataPath.replace('planets[].', '');
      
      // Handle array index notation like visual_elements[0]
      if (key.includes('[')) {
        const match = key.match(/([\w.]+)\[(\d+)\]/);
        if (match) {
          const arrayPath = match[1];
          const index = parseInt(match[2]);
          
          // Handle nested paths like visual_elements
          if (arrayPath.includes('.')) {
            const parts = arrayPath.split('.');
            value = payload.planet;
            for (const part of parts) {
              value = value?.[part];
            }
            value = value?.[index];
          } else {
            value = payload.planet?.[arrayPath]?.[index];
          }
        }
      } else {
        value = payload.planet?.[key];
      }
    }
    // Handle houses[] paths
    else if (dataPath.startsWith('houses[].')) {
      const key = dataPath.replace('houses[].', '');
      
      // Handle array index notation like keywords[0]
      if (key.includes('[')) {
        const match = key.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const arrayName = match[1];
          const index = parseInt(match[2]);
          value = payload.house?.[arrayName]?.[index];
        }
      } else {
        value = payload.house?.[key];
      }
    }
    // Handle signs[] paths
    else if (dataPath.startsWith('signs[].')) {
      const key = dataPath.replace('signs[].', '');
      
      // Handle array index notation like keywords[0]
      if (key.includes('[')) {
        const match = key.match(/([\w.]+)\[(\d+)\]/);
        if (match) {
          const arrayPath = match[1];
          const index = parseInt(match[2]);
          
          // Handle nested paths like keywords
          if (arrayPath.includes('.')) {
            const parts = arrayPath.split('.');
            value = payload.sign;
            for (const part of parts) {
              value = value?.[part];
            }
            value = value?.[index];
          } else {
            value = payload.sign?.[arrayPath]?.[index];
          }
        }
      }
      // Handle nested paths like visual_mappings.motion
      else if (key.includes('.')) {
        const parts = key.split('.');
        value = payload.sign;
        for (const part of parts) {
          value = value?.[part];
        }
      } else {
        value = payload.sign?.[key];
      }
    }
    // Handle aspects[] paths
    else if (dataPath.startsWith('aspects[].')) {
      const key = dataPath.replace('aspects[].', '');
      
      // Special handling for aspect.color - show it as a name instead of hex
      if (key === 'color') {
        const hexColor = payload.aspect?.color;
        if (hexColor) {
          // Return a visual representation instead of hex
          value = `this color`; // We'll style this with the actual color
        }
      }
      // Handle nested aspect paths like from.planet_name
      else if (key.includes('.')) {
        const parts = key.split('.');
        value = payload.aspect;
        for (const part of parts) {
          // Handle mismatched naming: planet_name vs planet.name
          if (part === 'planet_name' && value?.planet) {
            value = value.planet.name;
            break;
          } else {
            value = value?.[part];
          }
        }
      } else {
        value = payload.aspect?.[key];
      }
    }
    // Handle aspects_library[] paths (from dataset)
    else if (dataPath.includes('aspects_library')) {
      // Extract aspect type and path
      const aspectType = payload.aspect?.type;
      if (aspectType && integratedDataset?.aspects_library) {
        const aspectData = integratedDataset.aspects_library[aspectType];
        
        if (!aspectData) {
          console.warn(`No aspect data found for type: ${aspectType}`);
          return '—';
        }
        
        if (dataPath.includes('.relationship_type')) {
          value = aspectData?.relationship_type;
        } else if (dataPath.includes('.keywords[0]')) {
          value = aspectData?.keywords?.[0];
        } else if (dataPath.includes('.keywords[1]')) {
          value = aspectData?.keywords?.[1];
        } else {
          // Generic handling for other properties
          const propertyMatch = dataPath.match(/\.(\w+)$/);
          if (propertyMatch) {
            const property = propertyMatch[1];
            value = aspectData?.[property];
          }
        }
      }
    }

    // Return value or fallback
    if (value !== null && value !== undefined) {
      return String(value);
    }

    return '—';
  } catch (error) {
    console.error(`Error resolving variable ${variablePath}:`, error);
    return '—';
  }
}

/**
 * Get hover data for a variable
 */
function getHoverData(variablePath: string, payload: SentencePayload): HoverData | undefined {
  try {
    const schema = PLACEHOLDER_SCHEMA[variablePath as keyof typeof PLACEHOLDER_SCHEMA];
    if (!schema?.hover) {
      console.log(`⚠️ No schema.hover found for variable: ${variablePath}`);
      return undefined;
    }

    const { title, summary_from, fallback } = schema.hover;

    // Try to resolve summary from paths
    let summary = fallback;
    if (summary_from && summary_from.length > 0) {
      for (const path of summary_from) {
        const resolved = resolveVariable(variablePath, payload);
        if (resolved && resolved !== '—') {
          // Get additional context from summary paths
          const summaryKey = path.split('.').pop() || '';
          
          // Build a richer summary
          if (variablePath.includes('planet')) {
            // For aspect planets, get from aspect.from.planet or aspect.to.planet
            if (variablePath.includes('aspect.from')) {
              const planetData = payload.aspect?.from?.planet;
              const essence = planetData?.essence;
              const archetype = planetData?.archetype_name;
              if (essence || archetype) {
                summary = `${archetype || ''} — ${essence || ''}`.trim();
              }
            } else if (variablePath.includes('aspect.to')) {
              const planetData = payload.aspect?.to?.planet;
              const essence = planetData?.essence;
              const archetype = planetData?.archetype_name;
              if (essence || archetype) {
                summary = `${archetype || ''} — ${essence || ''}`.trim();
              }
            } else {
              // Regular planet hover
              const essence = payload.planet?.essence;
              const archetype = payload.planet?.archetype_name;
              if (essence || archetype) {
                summary = `${archetype || ''} — ${essence || ''}`.trim();
              }
            }
          } else if (variablePath.includes('house')) {
            const essence = payload.house?.essence;
            const keywords = payload.house?.keywords;
            if (essence) {
              summary = essence;
              if (keywords?.length) {
                summary += ` (${keywords.slice(0, 2).join(', ')})`;
              }
            }
          } else if (variablePath.includes('sign')) {
            const archetype = payload.sign?.archetype_name;
            const fusionLabel = payload.sign?.fusion_label;
            if (archetype || fusionLabel) {
              summary = `${fusionLabel || archetype || ''}`.trim();
            }
          } else if (variablePath.includes('aspect')) {
            const aspectType = payload.aspect?.type;
            if (aspectType && integratedDataset?.aspects_library) {
              const aspectData = integratedDataset.aspects_library[aspectType];
              summary = aspectData?.fluid_dynamics || fallback;
            }
          } else if (variablePath.includes('chart')) {
            // Use the resolved value directly for chart summaries
            summary = resolved;
          }
          break;
        }
      }
    }

    console.log(`✅ Generated hover data for ${variablePath}:`, { title, summary });

    return {
      title,
      summary,
      fallback
    };
  } catch (error) {
    console.error(`Error getting hover data for ${variablePath}:`, error);
    return undefined;
  }
}

/**
 * Get color for a variable based on its type
 */
function getVariableColor(variablePath: string, payload: SentencePayload, resolvedValue: string): string {
  // Planet colors - vibrant
  if (variablePath.includes('planet')) {
    // Get planet name
    const planetName = resolvedValue;
    const planetColors: Record<string, string> = {
      'Sun': '#FDB813',
      'Moon': '#C0C0D8',
      'Mercury': '#87CEEB',
      'Venus': '#FFB6C1',
      'Mars': '#FF4444',
      'Jupiter': '#FF8C00',
      'Saturn': '#8B7355',
      'Uranus': '#00CED1',
      'Neptune': '#9370DB',
      'Pluto': '#8B0000'
    };
    return planetColors[planetName] || '#9B5DE5';
  }
  
  // Sign colors - zodiac themed
  if (variablePath.includes('sign')) {
    const signName = resolvedValue;
    const signColors: Record<string, string> = {
      'Aries': '#FF6B6B',
      'Taurus': '#66BB6A',
      'Gemini': '#FFA726',
      'Cancer': '#C0C0D8',
      'Leo': '#FFD700',
      'Virgo': '#8BC34A',
      'Libra': '#FFB6C1',
      'Scorpio': '#8B0000',
      'Sagittarius': '#9C27B0',
      'Capricorn': '#795548',
      'Aquarius': '#00BCD4',
      'Pisces': '#7B68EE'
    };
    return signColors[signName] || '#9B5DE5';
  }
  
  // House colors
  if (variablePath.includes('house')) {
    return '#60A5FA'; // Blue for houses
  }
  
  // Aspect colors
  if (variablePath.includes('aspect.type')) {
    return '#F59E0B'; // Amber for aspect types
  }
  
  // Aspect color variable - use the actual aspect color
  if (variablePath === 'aspect.color') {
    return payload.aspect?.color || '#9B5DE5';
  }
  
  // Aspect relationship/keywords
  if (variablePath.includes('aspects_library')) {
    return '#EC4899'; // Pink for aspect qualities
  }
  
  // Element colors
  if (variablePath.includes('element')) {
    const element = resolvedValue.toLowerCase();
    if (element.includes('fire')) return '#FF6B6B';
    if (element.includes('earth')) return '#66BB6A';
    if (element.includes('air')) return '#87CEEB';
    if (element.includes('water')) return '#9370DB';
  }
  
  // Mode colors
  if (variablePath.includes('mode')) {
    return '#F59E0B'; // Amber for modes
  }
  
  // Default purple
  return '#9B5DE5';
}

/**
 * Parse template text into tokens with variable detection
 */
function parseTemplate(templateText: string, variables: string[], payload: SentencePayload): TokenData[] {
  const tokens: TokenData[] = [];
  let currentText = templateText;

  // Find all {{variable}} patterns
  const variablePattern = /\{\{([^}]+)\}\}/g;
  let match;
  let lastIndex = 0;

  while ((match = variablePattern.exec(templateText)) !== null) {
    // Add text before the variable
    if (match.index > lastIndex) {
      tokens.push({
        text: templateText.substring(lastIndex, match.index),
        isVariable: false
      });
    }

    // Add the variable token
    const variablePath = match[1];
    const resolvedValue = resolveVariable(variablePath, payload);
    const hoverData = getHoverData(variablePath, payload);
    const color = getVariableColor(variablePath, payload, resolvedValue);

    tokens.push({
      text: resolvedValue,
      isVariable: true,
      variablePath,
      hoverData,
      color
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < templateText.length) {
    tokens.push({
      text: templateText.substring(lastIndex),
      isVariable: false
    });
  }

  return tokens;
}

/**
 * Select a template based on context and weights
 */
function selectTemplate(context: SentenceContext, role?: 'primary' | 'cue'): Template | null {
  const candidates = ALL_TEMPLATES.filter(t => {
    if (t.context !== context) return false;
    if (role && t.role !== role) return false;
    return true;
  });

  if (candidates.length === 0) return null;

  // Weighted random selection
  const totalWeight = candidates.reduce((sum, t) => sum + t.weights, 0);
  let random = Math.random() * totalWeight;

  for (const template of candidates) {
    random -= template.weights;
    if (random <= 0) {
      return template;
    }
  }

  return candidates[0];
}

/**
 * Generate a sentence with tokens
 */
export function generateSentence(
  context: SentenceContext,
  payload: SentencePayload,
  role?: 'primary' | 'cue'
): { tokens: TokenData[]; templateId: string } | null {
  const template = selectTemplate(context, role);
  
  if (!template) {
    console.warn(`No template found for context: ${context}, role: ${role}`);
    return null;
  }

  const tokens = parseTemplate(template.text, template.variables, payload);

  return {
    tokens,
    templateId: template.id
  };
}

/**
 * Generate multiple sentences (useful for planet view with multiple cues)
 * Ensures no duplicate templates are used for cue sentences
 */
export function generateSentences(
  context: SentenceContext,
  payload: SentencePayload,
  count: number = 3
): { primary: TokenData[] | null; cues: TokenData[][] } {
  const primary = generateSentence(context, payload, 'primary');
  const cues: TokenData[][] = [];
  const usedTemplateIds = new Set<string>();

  // Track primary template ID
  if (primary?.templateId) {
    usedTemplateIds.add(primary.templateId);
  }

  // Generate unique cue sentences
  let attempts = 0;
  const maxAttempts = 20; // Prevent infinite loops

  while (cues.length < count - 1 && attempts < maxAttempts) {
    attempts++;
    const cue = generateSentence(context, payload, 'cue');
    
    if (cue && !usedTemplateIds.has(cue.templateId)) {
      cues.push(cue.tokens);
      usedTemplateIds.add(cue.templateId);
    }
  }

  return {
    primary: primary?.tokens || null,
    cues
  };
}

// ===== EVOLVING VIEW SUPPORT =====

// Type for evolving view seeds
export interface EvolvingSeed {
  id: string;
  label: string;
  poem: string;
  color: string;
  triadInfo?: {
    planet?: string;
    sign?: string;
    house?: string;
  };
}

// Type for evolving view core sentence
export interface EvolvingCore {
  sentence: string;
  sourceTriad: {
    planet: string;
    sign: string;
    house: string;
  };
}

// Type for evolving view orbiting fragments
export interface EvolvingFragment {
  id: string;
  label: string;        // short camouflaged tag
  poem: string;         // 1-2 line expanded text
  sourceContext?: {     // optional debugging/context info
    planetIds?: string[];
    houseIds?: number[];
    aspectTypes?: string[];
  };
}

/**
 * Regenerate a specific seed with a different template
 */
export function regenerateEvolvingSeed(seed: EvolvingSeed, enrichedChart: any): EvolvingSeed | null {
  if (!seed.triadInfo || !enrichedChart) return null;

  try {
    const { planet: planetName, sign: signName, house: houseName } = seed.triadInfo;
    
    const planetData = planetName ? integratedDataset?.planets?.find((p: any) => p.name === planetName) : null;
    const signData = signName ? integratedDataset?.signs?.find((s: any) => s.name === signName) : null;
    const houseData = houseName ? integratedDataset?.houses?.find((h: any) => h.name === houseName) : null;

    const payload = {
      planet: planetData,
      sign: signData,
      house: houseData,
      enrichedChart
    };

    // Generate new sentence (will randomly select a different template)
    const result = generateSentence('evolving_view', payload, 'cue'); // Use 'cue' to get variation
    if (result) {
      return {
        ...seed,
        poem: result.tokens.map(t => t.text).join('')
      };
    }
  } catch (error) {
    console.error('Error regenerating seed:', error);
  }

  return null;
}

/**
 * Generate core sentence for Evolving View
 * Uses the most significant planet (Sun, chart ruler, or most-aspected planet)
 */
export function generateEvolvingCore(enrichedChart: any): EvolvingCore | null {
  console.log('🌟 Generating evolving core sentence...');
  
  if (!enrichedChart || !enrichedChart.planets) {
    console.warn('⚠️ No enriched chart data available for core sentence');
    return null;
  }

  // Helper to extract planet data from enriched planet object
  const extractPlanetData = (enrichedPlanet: any) => {
    if (enrichedPlanet.planet && enrichedPlanet.sign && enrichedPlanet.house) {
      return {
        planetData: enrichedPlanet.planet,
        signData: enrichedPlanet.sign,
        houseData: enrichedPlanet.house
      };
    }
    return null;
  };

  // Find the Sun as the primary core planet
  const sunPlanet = enrichedChart.planets.find((ep: any) => 
    ep.planet?.name === 'Sun' || ep.name === 'Sun'
  );

  if (!sunPlanet) {
    console.warn('⚠️ No Sun planet found for core sentence');
    return null;
  }

  const extracted = extractPlanetData(sunPlanet);
  if (!extracted) {
    console.warn('⚠️ Could not extract planet data for core sentence');
    return null;
  }

  const { planetData, signData, houseData } = extracted;

  const payload = {
    planet: planetData,
    sign: signData,
    house: houseData,
    enrichedChart
  };

  // Generate the core sentence using 'primary' role
  const result = generateSentence('evolving_view', payload, 'primary');
  if (result) {
    const sentence = result.tokens.map(t => t.text).join('');
    console.log('✨ Generated core sentence:', sentence);
    
    return {
      sentence,
      sourceTriad: {
        planet: planetData?.name || 'Sun',
        sign: signData?.name || '',
        house: houseData?.name || ''
      }
    };
  }

  return null;
}

/**
 * Generate orbiting fragments for Evolving View
 * Creates 6-10 camouflaged phrases that expand into poems
 */
export function generateEvolvingFragments(enrichedChart: any): EvolvingFragment[] {
  const fragments: EvolvingFragment[] = [];
  
  console.log('🌙 Generating evolving fragments...');
  
  if (!enrichedChart || !enrichedChart.planets) {
    console.warn('⚠️ No enriched chart data available for fragments');
    return [];
  }

  // Helper to extract planet data from enriched planet object
  const extractPlanetData = (enrichedPlanet: any) => {
    if (enrichedPlanet.planet && enrichedPlanet.sign && enrichedPlanet.house) {
      return {
        planetData: enrichedPlanet.planet,
        signData: enrichedPlanet.sign,
        houseData: enrichedPlanet.house
      };
    }
    return null;
  };

  // Define which planets to use for fragments (excluding Sun which is used for core)
  const fragmentPlanets = ['Moon', 'Venus', 'Mars', 'Mercury', 'Jupiter', 'Saturn', 'Pluto', 'Neptune'];
  
  fragmentPlanets.forEach(planetName => {
    try {
      const enrichedPlanet = enrichedChart.planets.find((ep: any) => 
        ep.planet?.name === planetName || ep.name === planetName
      );

      if (!enrichedPlanet) {
        console.log(`⚠️ Planet ${planetName} not found`);
        return;
      }

      const extracted = extractPlanetData(enrichedPlanet);
      if (!extracted) {
        console.log(`⚠️ Could not extract data for ${planetName}`);
        return;
      }

      const { planetData, signData, houseData } = extracted;

      const payload = {
        planet: planetData,
        sign: signData,
        house: houseData,
        enrichedChart
      };

      // Generate a 'cue' sentence for the fragment
      const result = generateSentence('evolving_view', payload, 'cue');
      if (result) {
        const poem = result.tokens.map(t => t.text).join('');
        
        // Create a camouflaged label (short, mysterious)
        const label = `${signData?.fusion_label?.split(' ')[0] || signData?.name}`;
        
        fragments.push({
          id: planetName.toLowerCase(),
          label,
          poem,
          sourceContext: {
            planetIds: [planetName],
            houseIds: [houseData?.house_number],
            aspectTypes: []
          }
        });
      }
    } catch (error) {
      console.error(`Error generating fragment for ${planetName}:`, error);
    }
  });

  console.log(`✨ Generated ${fragments.length} evolving fragments`);
  return fragments;
}

/**
 * Regenerate a specific fragment with a different template
 */
export function regenerateEvolvingFragment(fragment: EvolvingFragment, enrichedChart: any): EvolvingFragment | null {
  if (!fragment.sourceContext?.planetIds?.[0] || !enrichedChart) return null;

  try {
    const planetName = fragment.sourceContext.planetIds[0];
    
    const enrichedPlanet = enrichedChart.planets.find((ep: any) => 
      ep.planet?.name === planetName || ep.name === planetName
    );

    if (!enrichedPlanet) return null;

    const extractPlanetData = (enrichedPlanet: any) => {
      if (enrichedPlanet.planet && enrichedPlanet.sign && enrichedPlanet.house) {
        return {
          planetData: enrichedPlanet.planet,
          signData: enrichedPlanet.sign,
          houseData: enrichedPlanet.house
        };
      }
      return null;
    };

    const extracted = extractPlanetData(enrichedPlanet);
    if (!extracted) return null;

    const { planetData, signData, houseData } = extracted;

    const payload = {
      planet: planetData,
      sign: signData,
      house: houseData,
      enrichedChart
    };

    // Generate new sentence with 'cue' role for variation
    const result = generateSentence('evolving_view', payload, 'cue');
    if (result) {
      return {
        ...fragment,
        poem: result.tokens.map(t => t.text).join('')
      };
    }
  } catch (error) {
    console.error('Error regenerating fragment:', error);
  }

  return null;
}