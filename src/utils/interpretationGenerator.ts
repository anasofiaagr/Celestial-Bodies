/**
 * Interpretation Generator
 * 
 * This module generates personalized astrological interpretations by combining
 * symbolic data from the JSON dataset with template-based narrative generation.
 * 
 * HOW IT WORKS:
 * 
 * 1. Takes chart data (planet, sign, house) as input
 * 2. Fetches corresponding symbolic data from the JSON dataset
 * 3. Uses randomized templates to weave a poetic interpretation
 * 4. Combines themes, fluid dynamics, questions, and archetypes
 * 
 * CUSTOMIZING TEMPLATES:
 * 
 * To adjust the narrative style, edit the template arrays in:
 * - createOpening(): How planet + sign are described
 * - createHouseContext(): How the house placement is explained
 * - selectQuestion(): Which reflective questions are chosen
 * 
 * Example template:
 * "Your ${planetEssence} (${planet.name}) dances with ${sign.name}'s ${signQuality}"
 * 
 * The randomChoice() method ensures variety across multiple interpretations.
 */

import { astroDataService, PlanetData, SignData, HouseData, AspectData } from './astroDataService';

interface PlanetPlacementInterpretation {
  planetName: string;
  signName: string;
  houseNumber: number;
  interpretation: string;
}

interface AspectInterpretation {
  aspectType: string;
  planet1: string;
  planet2: string;
  interpretation: string;
}

class InterpretationGenerator {
  // Generate a poetic interpretation for a planet in sign and house
  generatePlanetInterpretation(
    planetName: string,
    signName: string,
    houseNumber: number
  ): PlanetPlacementInterpretation | null {
    const placement = astroDataService.getPlanetPlacement(planetName, signName, houseNumber);
    
    if (!placement.planet || !placement.sign || !placement.house) {
      return null;
    }

    const planet = placement.planet;
    const sign = placement.sign;
    const house = placement.house;

    // Build the poetic interpretation
    const interpretation = this.buildPlacementNarrative(planet, sign, house);

    return {
      planetName,
      signName,
      houseNumber,
      interpretation,
    };
  }

  private buildPlacementNarrative(planet: PlanetData, sign: SignData, house: HouseData): string {
    // Opening: Planet essence + Sign expression
    const opening = this.createOpening(planet, sign);
    
    // Middle: House context
    const houseContext = this.createHouseContext(house, planet);
    
    // Closing: Reflective question
    const question = this.selectQuestion(planet, sign, house);

    return `${opening} ${houseContext} ${question}`;
  }

  private createOpening(planet: PlanetData, sign: SignData): string {
    const planetArchetype = planet.archetype_figure_name || planet.name;
    const planetEssence = planet.essence || 'essence';
    const signExpression = sign.expressions?.[0] || sign.element || 'energy';
    const fluidQuality = planet.fluid_qualities?.[0] || 'quality';
    
    // Extract a sign quality or archetype
    const signQuality = this.extractSignQuality(sign);
    const signArchetype = sign.cross_cultural_archetypes?.find(a => a.culture === 'Western')?.archetype || sign.name;

    const templates = [
      `Your ${planetEssence} (${planetArchetype}) dances with ${signArchetype}'s ${signQuality}, embodying ${signExpression.toLowerCase()}.`,
      `${planetArchetype}, carrier of ${planetEssence}, finds expression through ${signArchetype}'s ${signQuality}.`,
      `${planetArchetype} — your ${planetEssence} — flows with ${signArchetype}'s ${signExpression.toLowerCase()}, ${fluidQuality.toLowerCase()}.`,
      `Through ${signArchetype}, your ${planetArchetype} (${planetEssence}) takes on the quality of ${signExpression.toLowerCase()}.`,
    ];

    return this.randomChoice(templates);
  }

  private createSignContext(sign: SignData, planet: PlanetData): string {
    const planetEssence = planet.essence || 'essence';
    const signExpression = sign.expressions?.[0] || sign.element || 'energy';
    const fluidQuality = planet.fluid_qualities?.[0] || 'quality';
    
    // Extract a sign quality or archetype
    const signQuality = this.extractSignQuality(sign);

    const templates = [
      `Your ${planetEssence} (${planet.name}) dances with ${sign.name}'s ${signQuality}, embodying ${signExpression.toLowerCase()}.`,
      `The ${planet.name}, carrier of ${planetEssence}, finds expression through ${sign.name}'s ${signQuality}.`,
      `${planet.name} — your ${planetEssence} — flows with ${sign.name}'s ${signExpression.toLowerCase()}, ${fluidQuality.toLowerCase()}.`,
      `Through ${sign.name}, your ${planet.name} (${planetEssence}) takes on the quality of ${signExpression.toLowerCase()}.`,
    ];

    return this.randomChoice(templates);
  }

  private createHouseContext(house: HouseData, planet: PlanetData): string {
    const houseEssence = house.essence || 'life area';
    const houseKeywords = house.keywords?.slice(0, 3).join(', ') || 'themes';
    const planetFluid = planet.fluid_qualities?.[1] || planet.fluid_qualities?.[0] || 'energy';

    const templates = [
      `In the ${this.ordinal(house.house)} house of ${houseEssence}, this energy finds home in ${houseKeywords}.`,
      `The ${this.ordinal(house.house)} house — the realm of ${houseEssence} — becomes the stage for this ${planetFluid.toLowerCase()}.`,
      `Anchored in the ${this.ordinal(house.house)} house, this placement speaks to ${houseKeywords}.`,
      `This ${planetFluid.toLowerCase()} manifests through the ${this.ordinal(house.house)} house themes: ${houseKeywords}.`,
    ];

    return this.randomChoice(templates);
  }

  private selectQuestion(planet: PlanetData, sign: SignData, house: HouseData): string {
    const allQuestions = [
      ...(planet.reflective_questions || []),
      ...(sign.reflective_questions || []),
    ];

    if (allQuestions.length === 0) {
      return `Ask yourself: "How does this placement express itself in my life?"`;
    }

    const selectedQuestion = this.randomChoice(allQuestions);
    return `Ask yourself: "${selectedQuestion}"`;
  }

  private extractSignQuality(sign: SignData): string {
    // Use visual mappings or expressions to describe the sign
    const qualities = [
      sign.visual_mappings?.texture,
      sign.visual_mappings?.motion,
      sign.expressions?.[0],
    ].filter(Boolean);

    return this.randomChoice(qualities) || sign.element.toLowerCase() + ' energy';
  }

  // Generate aspect interpretation
  generateAspectInterpretation(
    aspectType: string,
    planet1Name: string,
    planet2Name: string
  ): AspectInterpretation | null {
    const aspect = astroDataService.getAspect(aspectType);
    const planet1 = astroDataService.getPlanet(planet1Name);
    const planet2 = astroDataService.getPlanet(planet2Name);

    if (!aspect || !planet1 || !planet2) {
      return null;
    }

    const interpretation = this.buildAspectNarrative(aspect, planet1, planet2);

    return {
      aspectType,
      planet1: planet1Name,
      planet2: planet2Name,
      interpretation,
    };
  }

  private buildAspectNarrative(aspect: AspectData, planet1: PlanetData, planet2: PlanetData): string {
    const planet1Archetype = planet1.archetype_figure_name || planet1.name;
    const planet2Archetype = planet2.archetype_figure_name || planet2.name;
    const aspectEssence = aspect.essence || 'dynamic';
    const fluidDynamic = aspect.fluid_dynamics?.[0] || aspectEssence;
    const question = aspect.reflective_questions?.[0] || 'How does this aspect shape your experience?';

    const templates = [
      `${planet1Archetype} (${planet1.essence}) forms a ${(aspect.type || 'aspect').toLowerCase()} with ${planet2Archetype} (${planet2.essence}) — a ${aspectEssence} that creates ${fluidDynamic.toLowerCase()}. ${question}`,
      `The ${(aspect.type || 'aspect').toLowerCase()} between ${planet1Archetype} and ${planet2Archetype} brings ${fluidDynamic.toLowerCase()}, weaving ${planet1.essence} with ${planet2.essence}. ${question}`,
      `A ${(aspect.type || 'aspect').toLowerCase()} connects your ${planet1.essence} (${planet1Archetype}) to your ${planet2.essence} (${planet2Archetype}), offering ${fluidDynamic.toLowerCase()}. ${question}`,
    ];

    return this.randomChoice(templates);
  }

  // Utility: Random choice from array
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Utility: Convert number to ordinal (1st, 2nd, 3rd, etc.)
  private ordinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // Generate all planet placements for a chart
  generateAllPlanetInterpretations(chartData: {
    planets: { name: string; sign: string; house: number }[];
  }): PlanetPlacementInterpretation[] {
    return chartData.planets
      .map((p) => this.generatePlanetInterpretation(p.name, p.sign, p.house))
      .filter((i): i is PlanetPlacementInterpretation => i !== null);
  }

  // Generate all aspect interpretations for detected aspects
  generateAllAspectInterpretations(aspects: {
    type: string;
    planet1: string;
    planet2: string;
  }[]): AspectInterpretation[] {
    return aspects
      .map((a) => this.generateAspectInterpretation(a.type, a.planet1, a.planet2))
      .filter((i): i is AspectInterpretation => i !== null);
  }
}

export const interpretationGenerator = new InterpretationGenerator();
export type { PlanetPlacementInterpretation, AspectInterpretation };