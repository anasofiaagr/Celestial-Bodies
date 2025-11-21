import React, { useMemo } from 'react';
import { CinematicKnowledgeModal } from './CinematicKnowledgeModal';
import { useGlossary } from '../../contexts/GlossaryContext';
import { useContextualGlossary, type ViewMode } from '../../hooks/useContextualGlossary';

// Import the same house colors used throughout the app
const HOUSE_COLORS = [
  '#F94144', '#F3722C', '#F8961E', '#F9C74F',
  '#90BE6D', '#43AA8B', '#577590', '#277DA1',
  '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'
];

interface GlossaryOverlayProps {
  viewMode: ViewMode;
  context?: {
    focusedHouseIndex?: number | null;
    focusedPlanetName?: string | null;
    aspectsVisible?: boolean;
    houseSign?: string;
  };
  isVisible?: boolean;
}

export function GlossaryOverlay({ viewMode, context, isVisible = true }: GlossaryOverlayProps) {
  const { glossaryData, openItem, setOpenItem } = useGlossary();

  const openItemData = useMemo(() => {
    if (!openItem) return { item: null, color: '#ffffff' };
    
    const items = glossaryData[openItem.category] as any[];
    const item = items?.[openItem.index];
    
    // Determine color
    let color = '#ffffff';
    if (openItem.category === 'planets' && item?.color) {
      color = item.color;
    } else if (openItem.category === 'houses') {
      color = HOUSE_COLORS[(item?.number || 1) - 1] || '#ffffff';
    } else if (openItem.category === 'zodiac_signs') {
      // Connect zodiac sign color to house color based on the house it's in
      // In house view, use the focused house's color
      if (viewMode === 'house' && context?.focusedHouseIndex !== null && context?.focusedHouseIndex !== undefined) {
        color = HOUSE_COLORS[context.focusedHouseIndex] || '#ffffff';
      } else {
        // Otherwise use the sign's index
        color = HOUSE_COLORS[openItem.index % 12] || '#ffffff';
      }
    } else if (openItem.category === 'aspects') {
      const aspectColors: Record<string, string> = {
        'Conjunction': '#FFD700',
        'Sextile': '#00C4CC',
        'Square': '#D72638',
        'Trine': '#4CAF50',
        'Opposition': '#3F51B5',
      };
      color = aspectColors[item?.name] || '#ffffff';
    }
    
    return { item, color };
  }, [openItem, glossaryData, viewMode, context?.focusedHouseIndex]);

  return (
    <>
      {/* Cinematic Knowledge Modal */}
      {openItem && (
        <CinematicKnowledgeModal
          item={openItemData.item}
          category={openItem.category}
          index={openItem.index}
          color={openItemData.color}
          onClose={() => setOpenItem(null)}
        />
      )}
    </>
  );
}