import { astroData } from "./astroData";

export interface PlanetData {
  name: string;
  glyph?: string;
  archetype_name?: string;
  archetype_figure_name?: string;
  position: { sign: string; degree: number; house: number };
  essence: string;
  why: string;
  traditional_associations: Array<{
    culture: string;
    association: string;
  }>;
  fluid_qualities: string[];
  reflective_questions: string[];
  visual_elements: string[];
}

export interface SignData {
  name: string;
  archetype_name?: string;
  element: string;
  glyph: string;
  visual_mappings: {
    shape: string;
    motion: string;
    texture: string;
    palette: string;
    rhythm: string;
  };
  cross_cultural_archetypes: Array<{
    culture: string;
    archetype: string;
  }>;
  expressions: string[];
  shadows: string[];
  reflective_questions: string[];
  visual_elements: string[];
}

export interface HouseData {
  house: number;
  essence: string;
  ruler: string;
  keywords: string[];
  visual_elements: string[];
}

export interface AspectData {
  type: string;
  orb: number;
  from: string;
  to: string;
  visual: { color: string; style: string };
  essence: string;
  fluid_dynamics: string[];
  reflective_questions: string[];
  visual_elements: string[];
}

class AstroDataService {
  private data = astroData;

  // Get planet data by name
  getPlanet(planetName: string): PlanetData | undefined {
    if (!planetName || typeof planetName !== "string")
      return undefined;
    return this.data.data.planets.find(
      (p: PlanetData) =>
        p.name.toLowerCase() === planetName.toLowerCase(),
    );
  }

  // Get sign data by name
  getSign(signName: string): SignData | undefined {
    if (!signName || typeof signName !== "string")
      return undefined;
    return this.data.data.signs.find(
      (s: SignData) =>
        s.name.toLowerCase() === signName.toLowerCase(),
    );
  }

  // Get house data by number
  getHouse(houseNumber: number): HouseData | undefined {
    return this.data.data.houses.find(
      (h: HouseData) => h.house === houseNumber,
    );
  }

  // Get aspect data by type
  getAspect(aspectType: string): AspectData | undefined {
    if (!aspectType) return undefined;
    return this.data.aspects.find(
      (a: AspectData) =>
        a.type.toLowerCase() === aspectType.toLowerCase(),
    );
  }

  // Get all aspect types
  getAllAspectTypes(): string[] {
    return this.data.aspects.map((a: AspectData) => a.type);
  }

  // Get planet-sign-house combination
  getPlanetPlacement(
    planetName: string,
    signName: string,
    houseNumber: number,
  ) {
    return {
      planet: this.getPlanet(planetName),
      sign: this.getSign(signName),
      house: this.getHouse(houseNumber),
    };
  }
}

export const astroDataService = new AstroDataService();