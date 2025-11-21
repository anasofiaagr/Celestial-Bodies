import { Html } from '@react-three/drei';
import { motion } from 'motion/react';
import { useState } from 'react';

// Multiple poetic cues for each house - organized by view type
const HOUSE_STAR_CUES = [
  {
    house: 1,
    color: '#F94144',
    cues: [
      { text: "Here, you arrive as yourself", view: "overview", position: [-0.8, 0, 0.3] },
      { text: "Unedited presence", view: "layer", position: [-0.6, 0.15, -0.4] },
      { text: "Raw becoming", view: "layer", position: [0.7, -0.1, 0.2] },
      { text: "First breath of becoming", view: "planet", position: [0.5, 0.2, -0.3] },
      { text: "Raw self, no apology", view: "planet", position: [-0.4, -0.15, 0.5] },
    ]
  },
  {
    house: 2,
    color: '#F3722C',
    cues: [
      { text: "What you hold, what sustains", view: "overview", position: [-0.75, 0, -0.35] },
      { text: "Sacred vessel", view: "layer", position: [0.65, 0.12, 0.25] },
      { text: "Grounded worth", view: "layer", position: [-0.55, -0.18, 0.4] },
      { text: "The body knows what mind forgets", view: "planet", position: [0.45, -0.2, -0.35] },
      { text: "Security grows from roots within", view: "planet", position: [-0.7, 0.15, 0.2] },
    ]
  },
  {
    house: 3,
    color: '#F8961E',
    cues: [
      { text: "Words weave connections", view: "overview", position: [0.7, 0, 0.4] },
      { text: "Speak, bridge", view: "layer", position: [-0.6, 0.18, -0.3] },
      { text: "Dancing mind", view: "layer", position: [0.5, -0.15, 0.35] },
      { text: "Curiosity as compass", view: "planet", position: [-0.55, -0.12, 0.45] },
      { text: "Every conversation a doorway", view: "planet", position: [0.65, 0.2, -0.25] },
    ]
  },
  {
    house: 4,
    color: '#F9C74F',
    cues: [
      { text: "Where you return to rest", view: "overview", position: [-0.8, 0, 0.25] },
      { text: "Memory sanctuary", view: "layer", position: [0.7, 0.15, -0.4] },
      { text: "Holding hearth", view: "layer", position: [-0.5, -0.2, 0.3] },
      { text: "Ancestral whispers in your bones", view: "planet", position: [0.6, -0.18, 0.35] },
      { text: "Home is what you carry inside", view: "planet", position: [-0.65, 0.12, -0.45] },
    ]
  },
  {
    house: 5,
    color: '#90BE6D',
    cues: [
      { text: "Pure delight expressed", view: "overview", position: [0.75, 0, -0.3] },
      { text: "Unpermissioned play", view: "layer", position: [-0.65, 0.2, 0.35] },
      { text: "Reasonless joy", view: "layer", position: [0.55, -0.12, -0.4] },
      { text: "Your inner child still knows the way", view: "planet", position: [-0.6, -0.15, 0.25] },
      { text: "Creativity flows when control releases", view: "planet", position: [0.7, 0.18, 0.4] },
    ]
  },
  {
    house: 6,
    color: '#43AA8B',
    cues: [
      { text: "What you tend daily", view: "overview", position: [-0.7, 0, 0.4] },
      { text: "Ritual meaning", view: "layer", position: [0.6, 0.15, -0.35] },
      { text: "Ordinary sacred", view: "layer", position: [-0.65, -0.18, 0.3] },
      { text: "Service as self-knowing", view: "planet", position: [0.55, -0.15, 0.45] },
      { text: "Perfection dissolves in practice", view: "planet", position: [-0.5, 0.2, -0.4] },
    ]
  },
  {
    house: 7,
    color: '#577590',
    cues: [
      { text: "You meet yourself in the other", view: "overview", position: [0.8, 0, 0.3] },
      { text: "Living reflection", view: "layer", position: [-0.7, 0.12, -0.4] },
      { text: "Revealing mirror", view: "layer", position: [0.65, -0.2, 0.25] },
      { text: "Union births something neither holds alone", view: "planet", position: [-0.6, -0.15, 0.4] },
      { text: "Balance found in honest exchange", view: "planet", position: [0.55, 0.18, -0.35] },
    ]
  },
  {
    house: 8,
    color: '#277DA1',
    cues: [
      { text: "What transforms in shadow", view: "overview", position: [-0.75, 0, -0.35] },
      { text: "Alchemical edge", view: "layer", position: [0.7, 0.2, 0.3] },
      { text: "Death, rebirth", view: "layer", position: [-0.55, -0.15, -0.45] },
      { text: "Intimacy asks everything", view: "planet", position: [0.6, -0.18, 0.4] },
      { text: "Power surrendered, power reclaimed", view: "planet", position: [-0.65, 0.15, 0.25] },
    ]
  },
  {
    house: 9,
    color: '#9B5DE5',
    cues: [
      { text: "The horizon calls", view: "overview", position: [0.7, 0, -0.4] },
      { text: "Expanding truth", view: "layer", position: [-0.6, 0.18, 0.35] },
      { text: "Beyond familiar", view: "layer", position: [0.65, -0.15, -0.3] },
      { text: "Every journey reshapes the traveler", view: "planet", position: [-0.55, -0.2, 0.45] },
      { text: "Wisdom blooms in the unknown", view: "planet", position: [0.75, 0.12, 0.3] },
    ]
  },
  {
    house: 10,
    color: '#F15BB5',
    cues: [
      { text: "How you stand visible", view: "overview", position: [-0.8, 0, 0.35] },
      { text: "Presence legacy", view: "layer", position: [0.6, 0.15, -0.4] },
      { text: "Earned authority", view: "layer", position: [-0.7, -0.18, 0.25] },
      { text: "The summit reveals what the climb taught", view: "planet", position: [0.55, -0.15, 0.4] },
      { text: "Public face, private truth", view: "planet", position: [-0.65, 0.2, -0.35] },
    ]
  },
  {
    house: 11,
    color: '#00BBF9',
    cues: [
      { text: "Belonging beyond blood", view: "overview", position: [0.75, 0, 0.3] },
      { text: "Chosen kinship", view: "layer", position: [-0.65, 0.12, -0.45] },
      { text: "Dreamed future", view: "layer", position: [0.7, -0.2, 0.35] },
      { text: "Community holds what one cannot", view: "planet", position: [-0.6, -0.15, 0.3] },
      { text: "Your vision needs their voices", view: "planet", position: [0.65, 0.18, -0.4] },
    ]
  },
  {
    house: 12,
    color: '#00F5D4',
    cues: [
      { text: "What dissolves into mystery", view: "overview", position: [-0.7, 0, -0.4] },
      { text: "Cosmic union", view: "layer", position: [0.65, 0.2, 0.25] },
      { text: "Returning ocean", view: "layer", position: [-0.55, -0.12, -0.35] },
      { text: "Compassion born from dissolution", view: "planet", position: [0.6, -0.18, 0.45] },
      { text: "Solitude as sacred conversation", view: "planet", position: [-0.75, 0.15, 0.3] },
    ]
  }
];

interface SingleStarCueProps {
  text: string;
  color: string;
  position: [number, number, number];
  layerRadius: number;
  centerY: number;
  delay: number;
  isPlanetView: boolean;
  isFocusedLayer: boolean;
  isAnyLayerFocused: boolean;
}

function SingleStarCue({ 
  text, 
  color, 
  position, 
  layerRadius, 
  centerY, 
  delay, 
  isPlanetView,
  isFocusedLayer,
  isAnyLayerFocused
}: SingleStarCueProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Scale position based on layer radius
  const scaledPosition: [number, number, number] = [
    position[0] * layerRadius,
    centerY + position[1] * 0.8,
    position[2] * layerRadius * 0.5
  ];

  // Calculate opacity based on focus state
  const getOpacity = () => {
    // In planet view, dim these floating phrases significantly
    if (isPlanetView) return isHovered ? 0.2 : 0.1;
    
    if (!isAnyLayerFocused) return isHovered ? 1 : 0.75; // Overview mode - normal
    if (isFocusedLayer) return isHovered ? 1 : 0.85; // This layer is focused - bright
    return 0.15; // Other layers - dimmed
  };

  return (
    <group position={scaledPosition}>
      {/* Star point with pulsing glow */}
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isAnyLayerFocused && !isFocusedLayer ? 0.2 : 0.95} 
        />
      </mesh>
      
      {/* Soft glow halo */}
      <mesh scale={2.5}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isAnyLayerFocused && !isFocusedLayer ? 0.08 : 0.25} 
        />
      </mesh>

      {/* Text floating near star - NO BOX */}
      <Html
        center
        distanceFactor={isPlanetView ? 8 : 12}
        position={[0.3, 0, 0]}
        style={{ pointerEvents: 'auto' }}
        zIndexRange={[100, 0]}
      >
        <motion.div
          initial={{ opacity: 0, x: -15, filter: 'blur(8px)' }}
          animate={{ 
            opacity: getOpacity(),
            x: 0,
            filter: 'blur(0px)',
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ 
            delay: delay,
            duration: 0.8,
            ease: [0.19, 1, 0.22, 1]
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer select-none"
          style={{ width: '300px' }}
        >
          <div className="relative flex items-center gap-2">
            {/* Connecting line from star to text */}
            <div 
              className="w-3 h-px flex-shrink-0"
              style={{
                background: `linear-gradient(to right, ${color}80, transparent)`,
                opacity: isAnyLayerFocused && !isFocusedLayer ? 0.3 : 1,
              }}
            />
            
            {/* Text with subtle glow - no box, wraps properly */}
            <div
              className="text-sm font-light italic leading-tight"
              style={{
                color: '#ffffff',
                textShadow: `
                  0 0 8px ${color}60,
                  0 0 16px ${color}40,
                  0 2px 4px rgba(0, 0, 0, 0.8)
                `,
                wordBreak: 'normal',
                overflowWrap: 'break-word',
              }}
            >
              {text}
            </div>
          </div>
        </motion.div>
      </Html>
    </group>
  );
}

interface HouseStarCuesProps {
  layerIndex: number;
  centerY: number;
  layerRadius: number;
  isVisible: boolean;
  viewMode: 'overview' | 'layer' | 'planet';
  isFocusedLayer: boolean;
  isAnyLayerFocused: boolean;
}

export function HouseStarCues({ 
  layerIndex, 
  centerY, 
  layerRadius, 
  isVisible,
  viewMode,
  isFocusedLayer,
  isAnyLayerFocused
}: HouseStarCuesProps) {
  const houseData = HOUSE_STAR_CUES[layerIndex];
  
  if (!isVisible || !houseData) return null;

  // Filter cues based on current view mode
  const activeCues = houseData.cues.filter(cue => {
    if (viewMode === 'overview') return cue.view === 'overview';
    if (viewMode === 'layer') return cue.view === 'overview' || cue.view === 'layer';
    if (viewMode === 'planet') return cue.view === 'planet';
    return false;
  });

  return (
    <>
      {activeCues.map((cue, index) => (
        <SingleStarCue
          key={`${layerIndex}-${index}`}
          text={cue.text}
          color={houseData.color}
          position={cue.position}
          layerRadius={layerRadius}
          centerY={centerY}
          delay={index * 0.15}
          isPlanetView={viewMode === 'planet'}
          isFocusedLayer={isFocusedLayer}
          isAnyLayerFocused={isAnyLayerFocused}
        />
      ))}
    </>
  );
}