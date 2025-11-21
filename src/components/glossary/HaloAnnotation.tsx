import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GlossaryItem } from '../../contexts/GlossaryContext';

interface HaloAnnotationProps {
  item: GlossaryItem;
  color: string;
  radius?: number;
  onDeepView: () => void;
}

export function HaloAnnotation({ item, color, radius = 50, onDeepView }: HaloAnnotationProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayName = item.name || item.term || '';
  const shortDesc = item.essence || item.description || '';
  const keywords = item.keywords?.slice(0, 4).join(' • ') || '';

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer"
      onClick={onDeepView}
    >
      {/* Base halo ring */}
      <motion.circle
        cx="0"
        cy="0"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={isHovered ? 3 : 1.5}
        opacity={isHovered ? 0.8 : 0.3}
        style={{
          filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none',
        }}
        initial={false}
        animate={{
          strokeWidth: isHovered ? 3 : 1.5,
          opacity: isHovered ? 0.8 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Pulsing outer ring on hover */}
      {isHovered && (
        <motion.circle
          cx="0"
          cy="0"
          r={radius + 5}
          fill="none"
          stroke={color}
          strokeWidth={0.5}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Curved tooltip text on hover */}
      {isHovered && (
        <>
          {/* Name */}
          <text
            textAnchor="middle"
            x="0"
            y={-radius - 15}
            fill="white"
            fontSize="11"
            fontWeight="500"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))',
              pointerEvents: 'none',
            }}
          >
            {displayName}
          </text>
          {/* Short description */}
          {shortDesc && (
            <text
              textAnchor="middle"
              x="0"
              y={-radius - 30}
              fill="white"
              fontSize="9"
              opacity="0.7"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))',
                pointerEvents: 'none',
              }}
            >
              {shortDesc.length > 50 ? shortDesc.substring(0, 50) + '...' : shortDesc}
            </text>
          )}
          {/* Keywords */}
          {keywords && (
            <text
              textAnchor="middle"
              x="0"
              y={radius + 20}
              fill={color}
              fontSize="8"
              opacity="0.6"
              fontStyle="italic"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))',
                pointerEvents: 'none',
              }}
            >
              {keywords}
            </text>
          )}
        </>
      )}
    </g>
  );
}
