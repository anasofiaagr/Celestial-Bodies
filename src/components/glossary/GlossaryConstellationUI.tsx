import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlossary } from '../../contexts/GlossaryContext';
import { useContextualGlossary, type ViewMode } from '../../hooks/useContextualGlossary';

// Import the same house colors used throughout the app
const HOUSE_COLORS = [
  '#F94144', '#F3722C', '#F8961E', '#F9C74F',
  '#90BE6D', '#43AA8B', '#577590', '#277DA1',
  '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'
];

interface GlossaryConstellationUIProps {
  viewMode: ViewMode;
  context?: {
    focusedHouseIndex?: number | null;
    focusedPlanetName?: string | null;
    aspectsVisible?: boolean;
    houseSign?: string;
  };
  isVisible?: boolean;
}

export function GlossaryConstellationUI({
  viewMode,
  context,
  isVisible = true,
}: GlossaryConstellationUIProps) {
  const { glossaryData, setOpenItem } = useGlossary();
  const contextualItems = useContextualGlossary(viewMode, context);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!isVisible) return null;

  // Get top 4 contextual items for circular display
  const displayItems = contextualItems
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);

  // NEON ASPECT-STYLE COLORS
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

  // Calculate circular positions for items
  const circleRadius = 35; // Distance from center (reduced for tighter grouping)
  const getCircularPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // Start from top
    return {
      x: Math.cos(angle) * circleRadius,
      y: Math.sin(angle) * circleRadius,
    };
  };

  return (
    <div className="fixed top-8 left-8 z-[100] pointer-events-auto">
      {/* Circular container */}
      <div className="relative" style={{ width: '120px', height: '120px' }}>
        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/10" />
        
        {displayItems.map((contextItem, idx) => {
          const items = glossaryData[contextItem.category] as any[];
          const item = items?.[contextItem.index];

          if (!item) return null;

          // Calculate circular position
          const position = getCircularPosition(idx, displayItems.length);

          // Determine color
          let color = neonColors[idx % neonColors.length];
          if (contextItem.category === 'planets' && item.color) {
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
          } else if (contextItem.category === 'houses') {
            // Houses use their number (1-12) to index into HOUSE_COLORS (0-11)
            color = HOUSE_COLORS[(item.number || 1) - 1] || neonColors[idx % neonColors.length];
          } else if (contextItem.category === 'zodiac_signs') {
            // In house view, use the focused house's color for the zodiac sign
            if (viewMode === 'house' && context?.focusedHouseIndex !== null && context?.focusedHouseIndex !== undefined) {
              color = HOUSE_COLORS[context.focusedHouseIndex] || neonColors[idx % neonColors.length];
            } else {
              // Otherwise use the sign's index
              color = HOUSE_COLORS[contextItem.index % 12] || neonColors[idx % neonColors.length];
            }
          }

          const isHovered = hoveredIndex === idx;

          return (
            <motion.div
              key={`${contextItem.category}-${contextItem.index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: position.x,
                y: position.y,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                delay: idx * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setOpenItem({ category: contextItem.category, index: contextItem.index })}
            >
              {/* Constellation mini-icon */}
              <motion.div
                className="relative cursor-pointer"
                animate={{
                  scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* SVG Constellation pattern */}
                <svg width="60" height="60" viewBox="0 0 60 60">
                  {/* Outer glow */}
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill={color}
                    opacity={isHovered ? 0.15 : 0.08}
                    filter="blur(8px)"
                  />
                  
                  {/* Star nodes */}
                  {[
                    [30, 10],
                    [45, 25],
                    [45, 40],
                    [30, 50],
                    [15, 40],
                    [15, 25],
                  ].map((pos, i) => (
                    <g key={i}>
                      {/* Glow */}
                      <circle
                        cx={pos[0]}
                        cy={pos[1]}
                        r="6"
                        fill={color}
                        opacity={isHovered ? 0.4 : 0.2}
                      />
                      {/* Star */}
                      <circle
                        cx={pos[0]}
                        cy={pos[1]}
                        r="3"
                        fill={color}
                        opacity={isHovered ? 1 : 0.9}
                      />
                    </g>
                  ))}

                  {/* Connecting lines */}
                  <g stroke={color} strokeWidth="1.5" opacity={isHovered ? 0.8 : 0.6} fill="none">
                    <path d="M 30 10 L 45 25 L 45 40 L 30 50 L 15 40 L 15 25 Z" />
                  </g>
                </svg>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-16 top-0 w-80 pointer-events-none"
                      style={{
                        background: 'rgba(0, 0, 0, 0.92)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${color}`,
                        boxShadow: `0 0 20px ${color}40`,
                      }}
                    >
                      <div className="p-5">
                        {/* Title */}
                        <div
                          className="mb-2 tracking-wide text-lg"
                          style={{ 
                            color,
                            fontFamily: 'var(--font-body)',
                            fontWeight: 500
                          }}
                        >
                          {contextItem.category === 'planets' 
                            ? item.archetype_name || item.name 
                            : contextItem.category === 'zodiac_signs' 
                              ? item.fusion_label || item.name 
                              : item.name || item.title}
                        </div>

                        {/* Category badge */}
                        <div
                          className="inline-block px-2 py-1 text-xs mb-3 rounded"
                          style={{
                            background: `${color}20`,
                            color: color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {contextItem.category.replace('_', ' ')}
                        </div>

                        {/* Description/Essence */}
                        <div className="text-sm text-white/70 leading-relaxed mb-3">
                          {item.essence || item.description || item.keywords?.slice(0, 3).join(' • ')}
                        </div>

                        {/* Additional info based on category */}
                        {contextItem.category === 'planets' && item.symbol && (
                          <div className="mt-3 text-2xl" style={{ color }}>
                            {item.symbol}
                          </div>
                        )}

                        {contextItem.category === 'zodiac_signs' && item.element && (
                          <div className="mt-2 text-xs text-white/50">
                            Element: {item.element} • Modality: {item.modality}
                          </div>
                        )}

                        {contextItem.category === 'aspects' && item.angle !== undefined && (
                          <div className="mt-2 text-xs text-white/50">
                            {item.angle}° • {item.orb}° orb
                          </div>
                        )}

                        {contextItem.category === 'houses' && (
                          <>
                            {item.traditional_name && (
                              <div className="mt-2 text-xs italic text-white/50">
                                Traditional: {item.traditional_name}
                              </div>
                            )}
                            {item.keywords && (
                              <div className="mt-2 text-xs text-white/50">
                                {item.keywords.slice(0, 3).join(' • ')}
                              </div>
                            )}
                          </>
                        )}

                        {/* Meaning from glossary_new.json */}
                        {(item.design_logic || item.queer_theory_links || item.origin_notes) && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="text-xs text-white/60 leading-relaxed">
                              {item.design_logic || item.queer_theory_links || item.origin_notes}
                            </div>
                          </div>
                        )}

                        {/* Click hint */}
                        <div className="mt-3 text-xs italic" style={{ color: `${color}80` }}>
                          Click to explore deeper meanings
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}