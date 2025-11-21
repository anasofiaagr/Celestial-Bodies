import { Html } from '@react-three/drei';
import { motion } from 'motion/react';
import { useState } from 'react';
import { getFusionLabel, getFusionLabelTooltipData } from '../utils/fluidAstrologyMappings';
import type { EnrichedChart } from '../utils/ChartEnricher';

interface FusionLabelProps {
  houseIndex: number;
  position: [number, number, number];
  color: string;
  opacity?: number;
  enrichedChart?: EnrichedChart | null;
}

export default function FusionLabel({ houseIndex, position, color, opacity = 1, enrichedChart }: FusionLabelProps) {
  const [isHovered, setIsHovered] = useState(false);
  const fusionLabel = getFusionLabel(houseIndex, enrichedChart);
  const tooltipData = getFusionLabelTooltipData(houseIndex, enrichedChart);

  return (
    <Html position={position} center zIndexRange={[0, 50]} sprite>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: opacity, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fusion Label Text */}
        <div
          className="px-4 py-2 rounded-full backdrop-blur-sm border cursor-help"
          style={{
            background: `linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))`,
            borderColor: `${color}60`,
            boxShadow: `0 0 20px ${color}40, 0 4px 12px rgba(0, 0, 0, 0.5)`,
          }}
        >
          <div
            className="text-xs font-light italic whitespace-nowrap"
            style={{
              color: '#ffffff',
              textShadow: `
                0 0 10px ${color}80,
                0 0 20px ${color}50,
                0 2px 8px rgba(0, 0, 0, 0.8)
              `,
            }}
          >
            {fusionLabel}
          </div>
        </div>

        {/* Tooltip on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 w-80 z-[50]"
          >
            <div
              className="px-5 py-4 rounded-xl backdrop-blur-xl border-2 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(10, 10, 20, 0.9))',
                borderColor: `${color}80`,
                boxShadow: `
                  0 8px 32px ${color}60,
                  0 0 40px ${color}30,
                  inset 0 1px 2px rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Title */}
              <div
                className="text-sm mb-2 tracking-wide"
                style={{
                  color: color,
                  textShadow: `0 0 10px ${color}60`,
                }}
              >
                {tooltipData.title}
              </div>

              {/* Description */}
              <div className="text-xs text-white/80 leading-relaxed mb-3">
                {tooltipData.description}
              </div>

              {/* Original sign name reference */}
              <div className="text-xs text-white/60 italic mb-2">
                Originally: {tooltipData.signName}
              </div>

              {/* Fluid Astrology note */}
              <div className="text-xs text-purple-300/70 italic leading-relaxed pt-2 border-t border-white/10">
                {tooltipData.note}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Html>
  );
}