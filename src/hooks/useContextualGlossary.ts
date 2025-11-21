import { useMemo } from 'react';
import { useGlossary, type GlossaryCategory } from '../contexts/GlossaryContext';

export type ViewMode = 'spiral' | 'house' | 'planet' | 'constellation' | 'flat';

interface ContextualGlossaryItem {
  category: GlossaryCategory;
  index: number;
  priority: number; // 1-10, higher = more relevant
}

/**
 * Returns relevant glossary items based on current view mode and context
 */
export function useContextualGlossary(
  viewMode: ViewMode,
  context?: {
    focusedHouseIndex?: number | null;
    focusedPlanetName?: string | null;
    aspectsVisible?: boolean;
    houseSign?: string;
  }
): ContextualGlossaryItem[] {
  const { glossaryData } = useGlossary();

  return useMemo(() => {
    const items: ContextualGlossaryItem[] = [];

    // Helper to find index in interface_concepts
    const findConceptIndex = (term: string): number => {
      const concepts = glossaryData.interface_concepts as any[];
      return concepts?.findIndex((c: any) => c.term === term) ?? -1;
    };

    // Helper to find planet index by name
    const findPlanetIndex = (name: string): number => {
      const planets = glossaryData.planets as any[];
      return planets?.findIndex((p: any) => p.name === name) ?? -1;
    };

    // Helper to find zodiac sign index by name
    const findZodiacSignIndex = (signName: string): number => {
      const signs = glossaryData.zodiac_signs as any[];
      return signs?.findIndex((s: any) => s.name === signName) ?? -1;
    };

    switch (viewMode) {
      case 'spiral':
        // Broad structural terms
        const ascendantIdx = findConceptIndex('Ascendant');
        const modalityIdx = findConceptIndex('Modality');
        const polarityIdx = findConceptIndex('Polarity');
        const elementIdx = findConceptIndex('Element');
        const fluidAstrologyIdx = findConceptIndex('Fluid Astrology');
        
        if (ascendantIdx !== -1) items.push({ category: 'interface_concepts', index: ascendantIdx, priority: 8 });
        if (modalityIdx !== -1) items.push({ category: 'interface_concepts', index: modalityIdx, priority: 7 });
        if (polarityIdx !== -1) items.push({ category: 'interface_concepts', index: polarityIdx, priority: 7 });
        if (elementIdx !== -1) items.push({ category: 'interface_concepts', index: elementIdx, priority: 7 });
        if (fluidAstrologyIdx !== -1) items.push({ category: 'interface_concepts', index: fluidAstrologyIdx, priority: 9 });
        items.push({ category: 'view_modes', index: 0, priority: 7 }); // Spiral View
        break;

      case 'house':
        // House-specific terms
        if (context?.focusedHouseIndex !== null && context?.focusedHouseIndex !== undefined) {
          items.push(
            { category: 'houses', index: context.focusedHouseIndex, priority: 10 }
          );
          
          const houseFieldIdx = findConceptIndex('House Field');
          const fusionLabelIdx = findConceptIndex('Fusion Label');
          const cuspIdx = findConceptIndex('Cusp');
          const starCuesIdx = findConceptIndex('Star Cues');
          
          if (houseFieldIdx !== -1) items.push({ category: 'interface_concepts', index: houseFieldIdx, priority: 8 });
          if (fusionLabelIdx !== -1) items.push({ category: 'interface_concepts', index: fusionLabelIdx, priority: 9 });
          if (cuspIdx !== -1) items.push({ category: 'interface_concepts', index: cuspIdx, priority: 7 });
          if (starCuesIdx !== -1) items.push({ category: 'interface_concepts', index: starCuesIdx, priority: 7 });
          
          // Add the corresponding zodiac sign from chart data
          if (context?.houseSign) {
            const signIndex = findZodiacSignIndex(context.houseSign);
            if (signIndex !== -1) {
              items.push({ category: 'zodiac_signs', index: signIndex, priority: 9 });
            }
          }
        }
        items.push({ category: 'view_modes', index: 1, priority: 7 }); // House Layer View
        break;

      case 'planet':
        // Planet-specific terms
        if (context?.focusedPlanetName) {
          const planetIndex = findPlanetIndex(context.focusedPlanetName);
          if (planetIndex !== -1) {
            items.push({ category: 'planets', index: planetIndex, priority: 10 });
            
            const archetypeIdx = findConceptIndex('Archetypal Figure');
            const eclipticIdx = findConceptIndex('Ecliptic Degree');
            const ziplineIdx = findConceptIndex('Zipline');
            
            if (archetypeIdx !== -1) items.push({ category: 'interface_concepts', index: archetypeIdx, priority: 9 });
            if (eclipticIdx !== -1) items.push({ category: 'interface_concepts', index: eclipticIdx, priority: 7 });
            if (ziplineIdx !== -1) items.push({ category: 'interface_concepts', index: ziplineIdx, priority: 7 });
          }
        }
        items.push({ category: 'view_modes', index: 2, priority: 7 }); // Planet View
        break;

      case 'constellation':
        // Aspect-focused terms - add Opposition with highest priority
        items.push(
          { category: 'aspects', index: 4, priority: 10 }, // Opposition - highest priority
          { category: 'aspects', index: 0, priority: 8 }, // Conjunction
          { category: 'aspects', index: 1, priority: 8 }, // Sextile
          { category: 'aspects', index: 2, priority: 8 }, // Square
          { category: 'aspects', index: 3, priority: 8 }  // Trine
        );
        
        const orbIdx = findConceptIndex('Orb');
        if (orbIdx !== -1) items.push({ category: 'interface_concepts', index: orbIdx, priority: 7 });
        items.push({ category: 'view_modes', index: 3, priority: 7 }); // Constellation View
        break;

      case 'flat':
        // Wheel/structural terms
        const eclipticFlatIdx = findConceptIndex('Ecliptic Degree');
        const elementFlatIdx = findConceptIndex('Element');
        
        if (eclipticFlatIdx !== -1) items.push({ category: 'interface_concepts', index: eclipticFlatIdx, priority: 8 });
        if (elementFlatIdx !== -1) items.push({ category: 'interface_concepts', index: elementFlatIdx, priority: 7 });
        items.push({ category: 'view_modes', index: 4, priority: 9 }); // Flat View
        break;
    }

    // Filter out items with invalid indices
    return items.filter((item) => item.index !== -1);
  }, [viewMode, context?.focusedHouseIndex, context?.focusedPlanetName, context?.aspectsVisible, context?.houseSign, glossaryData]);
}