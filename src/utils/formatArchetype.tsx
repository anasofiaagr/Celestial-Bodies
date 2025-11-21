import { ReactElement } from 'react';
import ArchetypeTooltip from '../components/ArchetypeTooltip';
import { astroDataService } from './astroDataService';

/**
 * Formats planet/sign names with archetype names and hover tooltips
 */

export function formatPlanetWithArchetype(planetName: string): string | ReactElement {
  const planetData = astroDataService.getPlanet(planetName);
  
  if (!planetData || !planetData.archetype_figure_name) {
    return planetName; // Fallback to traditional name
  }

  // Return the archetype_figure_name (e.g., "The Hero" for Sun)
  return planetData.archetype_figure_name;
}

export function formatSignWithArchetype(signName: string): string {
  const signData = astroDataService.getSign(signName);
  
  if (!signData || !signData.cross_cultural_archetypes || signData.cross_cultural_archetypes.length === 0) {
    return signName; // Fallback to traditional name
  }

  // Get the Western archetype
  const westernArchetype = signData.cross_cultural_archetypes.find(a => a.culture === 'Western');
  return westernArchetype?.archetype || signName;
}

// For JSX rendering with tooltips
export function PlanetArchetype({ planetName }: { planetName: string }) {
  const planetData = astroDataService.getPlanet(planetName);
  
  if (!planetData || !planetData.archetype_figure_name) {
    return <span>{planetName}</span>;
  }

  return (
    <ArchetypeTooltip
      archetypeName={planetData.archetype_figure_name}
      traditionalName={planetName}
      type="planet"
    />
  );
}

export function SignArchetype({ signName }: { signName: string }) {
  const signData = astroDataService.getSign(signName);
  
  if (!signData || !signData.cross_cultural_archetypes || signData.cross_cultural_archetypes.length === 0) {
    return <span>{signName}</span>;
  }

  const westernArchetype = signData.cross_cultural_archetypes.find(a => a.culture === 'Western');
  const archetypeName = westernArchetype?.archetype || signName;

  return (
    <ArchetypeTooltip
      archetypeName={archetypeName}
      traditionalName={signName}
      type="sign"
    />
  );
}
