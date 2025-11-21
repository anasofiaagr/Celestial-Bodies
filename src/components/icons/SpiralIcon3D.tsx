import { motion } from 'motion/react';
import { useRef } from 'react';

interface SpiralIcon3DProps {
  size?: number;
  animate?: boolean;
}

export function SpiralIcon3D({ size = 24, animate = true }: SpiralIcon3DProps) {
  // Rainbow colors matching the house spiral layers
  const LAYER_COLORS = [
    '#FEE440', // Yellow
    '#F15BB5', // Pink
    '#9B5DE5', // Purple
    '#00BBF9', // Cyan
    '#00F5D4', // Teal
    '#F72585', // Magenta
    '#4361EE', // Blue
    '#06FFA5', // Green
  ];

  return (
    <div 
      className="relative inline-block"
      style={{ 
        width: size, 
        height: size,
        perspective: '400px',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          transform: 'rotateX(55deg) rotateZ(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 8 spiral layers */}
        {LAYER_COLORS.map((color, index) => {
          const layerCount = LAYER_COLORS.length;
          const radius = 45 - (index * 4.5); // Decreasing radius for each layer
          const yOffset = 50 + (index * 3); // Increased vertical offset for better 3D depth
          const turns = 2.5; // Number of spiral turns
          const points = 50;
          
          // Generate spiral path
          let pathData = '';
          for (let i = 0; i <= points; i++) {
            const t = i / points;
            const angle = t * Math.PI * 2 * turns;
            const r = radius * (1 - t * 0.7); // Radius decreases as we spiral in
            const x = 50 + r * Math.cos(angle);
            const y = yOffset + r * Math.sin(angle) * 0.5; // Flatten Y for perspective
            
            if (i === 0) {
              pathData += `M ${x},${y}`;
            } else {
              pathData += ` L ${x},${y}`;
            }
          }

          return (
            <motion.path
              key={index}
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth={3.5}
              strokeLinecap="round"
              opacity={0.95}
              initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
              animate={animate ? {
                pathLength: 1,
                opacity: 0.95,
                rotate: 360,
              } : undefined}
              transition={{
                pathLength: { duration: 1.5, delay: index * 0.1, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: index * 0.1 },
                rotate: { 
                  duration: 20 + index * 2, 
                  repeat: Infinity, 
                  ease: 'linear',
                  delay: index * 0.1 
                }
              }}
              style={{
                transformOrigin: '50% 50%',
                filter: `drop-shadow(0 0 4px ${color}70)`,
              }}
            />
          );
        })}

        {/* Central glow */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="white"
          opacity={1}
          animate={animate ? {
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
          } : undefined}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))',
          }}
        />
      </svg>
    </div>
  );
}