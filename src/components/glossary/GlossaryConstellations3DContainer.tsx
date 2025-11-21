import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from '../../utils/three';
import { GlossaryConstellation3D } from './GlossaryConstellation3D';
import { useGlossary } from '../../contexts/GlossaryContext';
import { useContextualGlossary, type ViewMode } from '../../hooks/useContextualGlossary';

interface GlossaryConstellations3DContainerProps {
  viewMode: ViewMode;
  context?: {
    focusedHouseIndex?: number | null;
    focusedPlanetName?: string | null;
    aspectsVisible?: boolean;
  };
  isVisible?: boolean;
  spiralRadius?: number;
  layerHeight?: number;
}

export function GlossaryConstellations3DContainer({
  viewMode,
  context,
  isVisible = true,
  spiralRadius = 4,
  layerHeight = 1.2,
}: GlossaryConstellations3DContainerProps) {
  const { glossaryData, setOpenItem } = useGlossary();
  const contextualItems = useContextualGlossary(viewMode, context);
  const { camera } = useThree();

  // Generate 3D positions for constellations based on the spiral structure
  const constellations = useMemo(() => {
    if (!isVisible) return [];

    return contextualItems
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5) // Max 5 constellations at once
      .map((contextItem, idx) => {
        // Get actual item data
        const items = glossaryData[contextItem.category] as any[];
        const item = items?.[contextItem.index];

        if (!item) return null;

        // Get camera position for relative positioning
        const camPos = camera.position;
        const cameraLookVector = camera.getWorldDirection(new THREE.Vector3());

        // Position constellations around the spiral
        let position: [number, number, number];

        if (viewMode === 'spiral') {
          // Distribute around the spiral at different heights
          const angle = (idx / 5) * Math.PI * 2;
          const radius = spiralRadius + 1.5; // Outside the spiral
          const height = idx * layerHeight * 2.5; // Stagger vertically
          position = [
            Math.cos(angle) * radius,
            height - 6, // Offset from top
            Math.sin(angle) * radius,
          ];
        } else if (viewMode === 'house' && context?.focusedHouseIndex !== null && context?.focusedHouseIndex !== undefined) {
          // Position NEAR THE CAMERA in house view - always visible
          const layerY = context.focusedHouseIndex * -layerHeight;
          
          // Distribute around the camera's current view
          const angle = (idx / 5) * Math.PI * 2;
          const distance = 3; // Distance from camera
          const spread = 2; // Horizontal spread
          
          // Offset from camera looking direction
          const offsetX = Math.cos(angle) * spread;
          const offsetZ = Math.sin(angle) * spread;
          
          position = [
            camPos.x + offsetX,
            layerY, // Stay at the focused layer height
            camPos.z + offsetZ,
          ];
        } else if (viewMode === 'planet' && context?.focusedPlanetName) {
          // Position NEAR THE CAMERA in planet view - orbit around camera
          const angle = (idx / 5) * Math.PI * 2;
          const distance = 2.5;
          const offsetX = Math.cos(angle) * distance;
          const offsetZ = Math.sin(angle) * distance;
          
          position = [
            camPos.x + offsetX,
            camPos.y + (Math.random() - 0.5) * 1,
            camPos.z + offsetZ,
          ];
        } else if (viewMode === 'constellation') {
          // Float in deep space around the constellation
          const angle = (idx / 5) * Math.PI * 2;
          const radius = 8 + Math.random() * 2;
          position = [
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 4,
            Math.sin(angle) * radius,
          ];
        } else {
          // Default positioning (flat view, etc.)
          const angle = (idx / 5) * Math.PI * 2;
          const radius = spiralRadius + 2;
          position = [
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 2,
            Math.sin(angle) * radius,
          ];
        }

        // NEON ASPECT-STYLE COLORS for all categories
        const neonColors = [
          '#FFD700', // Gold (Conjunction)
          '#00C4CC', // Cyan (Sextile)
          '#D72638', // Red (Square)
          '#4CAF50', // Green (Trine)
          '#3F51B5', // Blue (Opposition)
          '#FF6B6B', // Bright Red
          '#4ECDC4', // Bright Cyan
          '#FFD166', // Yellow
          '#A78BFA', // Purple
          '#F15BB5', // Pink
        ];

        // Determine color - use neon palette with rotation
        let color = '#ffffff';
        if (contextItem.category === 'planets' && item.color) {
          // Keep planet colors but make them more vibrant
          color = item.color;
        } else if (contextItem.category === 'aspects') {
          const aspectColors: Record<string, string> = {
            'Conjunction': '#FFD700',
            'Sextile': '#00C4CC',
            'Square': '#D72638',
            'Trine': '#4CAF50',
            'Opposition': '#3F51B5',
          };
          color = aspectColors[item.name] || neonColors[idx % neonColors.length];
        } else {
          // All other categories use the neon color rotation
          color = neonColors[idx % neonColors.length];
        }

        return {
          item,
          category: contextItem.category,
          index: contextItem.index,
          position,
          color,
        };
      })
      .filter(Boolean);
  }, [contextualItems, glossaryData, isVisible, viewMode, context, spiralRadius, layerHeight, camera]);

  if (!isVisible) return null;

  return (
    <>
      {constellations.map((constellation: any, idx: number) => (
        <GlossaryConstellation3D
          key={`${constellation.category}-${constellation.index}-${idx}`}
          item={constellation.item}
          category={constellation.category}
          index={constellation.index}
          position={constellation.position}
          color={constellation.color}
          onDeepView={() =>
            setOpenItem({ category: constellation.category, index: constellation.index })
          }
        />
      ))}
    </>
  );
}