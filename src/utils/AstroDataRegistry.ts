// AstroDataRegistry.ts
// Loads and types the local integrated dataset and sentence templates

import integratedData from "../data/newest_integrated_dataset";
import sentenceTemplatesData from "../data/sentence_templates";

export type FluidPlanet = {
  name: string;
  archetype_name: string;
  archetype_figure_name: string;
  essence: string;
  visual_elements: string[];
  shadow_aspects: string[];
  light_aspects: string[];
  color?: string;
  glyph?: string;
  keywords?: string[];
};

export type FluidSign = {
  name: string;
  archetype_name: string;
  element: string;
  modality: string;
  polarity: string;
  essence: string;
  visual_mappings: {
    shape: string;
    motion: string;
    texture: string;
    palette: string;
    rhythm: string;
  };
  keywords?: string[];
  color?: string;
};

export type FluidHouse = {
  house: number;
  name: string;
  essence: string;
  ruler: string;
  keywords: string[];
  visual_elements: string[];
  color?: string;
  themes?: string[];
};

export type AspectLibraryEntry = {
  name: string;
  angle: number;
  orb: number;
  quality: string;
  keywords: string[];
  color?: string;
  description?: string;
};

export type PlaceholderSchema = {
  path: string;
  description: string;
  hover_summary?: string;
  ui_hints?: {
    style?: string;
    color?: string;
    underline?: boolean;
  };
};

export type SentenceTemplate = {
  id: string;
  context: string;
  template: string;
  weight?: number;
  placeholder_schema: {
    [key: string]: PlaceholderSchema;
  };
  metadata?: {
    mood?: string;
    tone?: string;
    imagery?: string;
  };
};

export type TemplateSet = {
  templates: SentenceTemplate[];
  contexts: {
    [context: string]: string[];
  };
};

// Export typed dataset
export const FluidAstroData = {
  planets: integratedData.planets as FluidPlanet[],
  signs: integratedData.signs as FluidSign[],
  houses: integratedData.houses as FluidHouse[],
  aspectsLibrary: (integratedData as any).aspects_library as {
    [type: string]: AspectLibraryEntry;
  },
  templates: sentenceTemplatesData as TemplateSet,
};

/**
 * Helper functions to find data by name/id
 */
export function findPlanetByName(
  name: string,
): FluidPlanet | undefined {
  if (!name || typeof name !== "string") return undefined;
  return FluidAstroData.planets.find(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  );
}

export function findSignByName(
  name: string,
): FluidSign | undefined {
  if (!name || typeof name !== "string") return undefined;
  return FluidAstroData.signs.find(
    (s) => s.name.toLowerCase() === name.toLowerCase(),
  );
}

export function findHouseById(
  id: number,
): FluidHouse | undefined {
  return FluidAstroData.houses.find((h) => h.house === id);
}

export function findAspectLibraryEntry(
  type: string,
): AspectLibraryEntry | undefined {
  if (!type || typeof type !== "string") return undefined;
  const normalizedType = type
    .toLowerCase()
    .replace(/\s+/g, "_");
  return (
    FluidAstroData.aspectsLibrary[normalizedType] ||
    FluidAstroData.aspectsLibrary[type]
  );
}