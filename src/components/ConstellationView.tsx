import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ArrowLeft, FileText } from 'lucide-react';
import { Html } from '@react-three/drei';
import * as THREE from '../utils/three';
import { astroData } from '../utils/astroData';
import ConstellationPoeticPhrase from './ConstellationPoeticPhrase';

// Planet archetype names
const PLANET_ARCHETYPES: Record<string, string> = {
  'Sun': 'The Hero',
  'Moon': 'The Nurturer',
  'Mercury': 'The Messenger',
  'Venus': 'The Lover',
  'Mars': 'The Warrior',
  'Jupiter': 'The Sage',
  'Saturn': 'The Builder',
  'Uranus': 'The Rebel',
  'Neptune': 'The Mystic',
  'Pluto': 'The Alchemist',
};

// Planet essences
const PLANET_ESSENCES: Record<string, string> = {
  'Sun': 'vitality',
  'Moon': 'emotion',
  'Mercury': 'thought',
  'Venus': 'attraction',
  'Mars': 'will',
  'Jupiter': 'expansion',
  'Saturn': 'structure',
  'Uranus': 'liberation',
  'Neptune': 'transcendence',
  'Pluto': 'transformation',
};

// Aspect styles from the dataset
const ASPECT_STYLES = {
  Conjunction: { 
    color: '#FFD166', 
    glow: 'medium', 
    pulse: 'slow',
    keyword: 'fusion',
    verb: 'fuses'
  },
  Opposition: { 
    color: '#EF476F', 
    glow: 'high', 
    pulse: 'medium',
    keyword: 'mirror',
    verb: 'opposes'
  },
  Square: { 
    color: '#06D6A0', 
    glow: 'medium', 
    pulse: 'fast',
    keyword: 'friction',
    verb: 'challenges'
  },
  Trine: { 
    color: '#118AB2', 
    glow: 'soft', 
    pulse: 'slow',
    keyword: 'flow',
    verb: 'harmonizes with'
  },
  Sextile: { 
    color: '#8338EC', 
    glow: 'soft', 
    pulse: 'medium',
    keyword: 'invitation',
    verb: 'invites'
  },
};

// Planet glyphs
const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
};

// Planet colors
const PLANET_COLORS: Record<string, string> = {
  Sun: '#F9C74F',
  Moon: '#90DBF4',
  Mercury: '#F8961E',
  Venus: '#F3722C',
  Mars: '#F94144',
  Jupiter: '9B5DE5',
  Saturn: '#577590',
  Uranus: '#43AA8B',
  Neptune: '#4D908E',
  Pluto: '#277DA1',
};

interface Aspect {
  planetA: string;
  planetB: string;
  type: 'Conjunction' | 'Opposition' | 'Square' | 'Trine' | 'Sextile';
  strength: number;
  orb: number;
  color: string;
}

interface ConstellationViewProps {
  onBack: () => void;
  onViewPoem: () => void;
  onPlanetClick?: (planetName: string) => void;
}

export default function ConstellationView({ 
  onBack, 
  onViewPoem,
  onPlanetClick 
}: ConstellationViewProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<Aspect | null>(null);
  const [showText, setShowText] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate constellation data
  const constellationData = useMemo(() => {
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    
    // Generate aspects between planets
    const aspects: Aspect[] = [
      { planetA: 'Sun', planetB: 'Mars', type: 'Trine', strength: 0.85, orb: 2.5, color: ASPECT_STYLES.Trine.color },
      { planetA: 'Venus', planetB: 'Jupiter', type: 'Sextile', strength: 0.72, orb: 3.2, color: ASPECT_STYLES.Sextile.color },
      { planetA: 'Saturn', planetB: 'Pluto', type: 'Square', strength: 0.91, orb: 1.8, color: ASPECT_STYLES.Square.color },
      { planetA: 'Moon', planetB: 'Saturn', type: 'Opposition', strength: 0.78, orb: 2.1, color: ASPECT_STYLES.Opposition.color },
      { planetA: 'Sun', planetB: 'Mercury', type: 'Conjunction', strength: 0.95, orb: 0.5, color: ASPECT_STYLES.Conjunction.color },
      { planetA: 'Venus', planetB: 'Neptune', type: 'Trine', strength: 0.68, orb: 4.2, color: ASPECT_STYLES.Trine.color },
      { planetA: 'Mars', planetB: 'Uranus', type: 'Square', strength: 0.82, orb: 2.8, color: ASPECT_STYLES.Square.color },
      { planetA: 'Jupiter', planetB: 'Neptune', type: 'Sextile', strength: 0.65, orb: 3.9, color: ASPECT_STYLES.Sextile.color },
      { planetA: 'Mercury', planetB: 'Uranus', type: 'Trine', strength: 0.71, orb: 3.5, color: ASPECT_STYLES.Trine.color },
      { planetA: 'Moon', planetB: 'Pluto', type: 'Square', strength: 0.76, orb: 2.9, color: ASPECT_STYLES.Square.color },
    ];

    // Position planets in 3D space based on aspect geometry
    const planetPositions = calculatePlanetPositions(planets, aspects);

    return { planets, aspects, planetPositions };
  }, []);

  // Calculate dominant aspect
  const dominantAspect = useMemo(() => {
    return constellationData.aspects.reduce((prev, current) => 
      current.strength > prev.strength ? current : prev
    );
  }, [constellationData.aspects]);

  // Show text after mount
  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const intensityPhrase = dominantAspect.strength >= 0.85 ? 'undeniable force' :
                         dominantAspect.strength >= 0.60 ? 'clear presence' :
                         dominantAspect.strength >= 0.35 ? 'subtle whisper' :
                         'faint echo';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
        {/* Galaxy spiral texture */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 70%)`,
            backgroundSize: '150% 150%',
          }}
        />
      </div>

      {/* Drifting interstellar dust particles */}
      <InterstellarDust mousePosition={mousePosition} />

      {/* 3D Constellation Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 25], fov: 60 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 10]} intensity={0.5} color="#8b5cf6" />
          
          <ConstellationNetwork
            planets={constellationData.planets}
            aspects={constellationData.aspects}
            planetPositions={constellationData.planetPositions}
            hoveredPlanet={hoveredPlanet}
            hoveredAspect={hoveredAspect}
            onPlanetHover={setHoveredPlanet}
            onAspectHover={setHoveredAspect}
            onPlanetClick={onPlanetClick}
          />
        </Canvas>
      </div>

      {/* Tooltips */}
      <PlanetTooltip 
        planet={hoveredPlanet} 
        mousePosition={mousePosition}
      />
      <AspectTooltip 
        aspect={hoveredAspect} 
        mousePosition={mousePosition}
      />

      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="absolute bottom-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Spiral</span>
      </motion.button>

      {/* View Poem Button */}
      <motion.button
        onClick={onViewPoem}
        className="absolute bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 10px rgba(168, 85, 247, 0.3)',
            '0 0 20px rgba(168, 85, 247, 0.5)',
            '0 0 10px rgba(168, 85, 247, 0.3)',
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        }}
      >
        <FileText className="w-4 h-4" />
        <span className="text-sm">View Poem</span>
      </motion.button>

      {/* Floating Poetic Phrases - 3-4 scattered around */}
      <AnimatePresence>
        {showText && (
          <>
            <ConstellationPoeticPhrase
              aspect={constellationData.aspects[0]}
              position={{ x: "15%", y: "20%" }}
              delay={1.2}
            />
            <ConstellationPoeticPhrase
              aspect={constellationData.aspects[2]}
              position={{ x: "70%", y: "30%" }}
              delay={1.8}
            />
            <ConstellationPoeticPhrase
              aspect={constellationData.aspects[5]}
              position={{ x: "25%", y: "75%" }}
              delay={2.4}
            />
            <ConstellationPoeticPhrase
              aspect={dominantAspect}
              position={{ x: "75%", y: "65%" }}
              delay={3.0}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Calculate planet positions in 3D space
function calculatePlanetPositions(
  planets: string[], 
  aspects: Aspect[]
): Record<string, [number, number, number]> {
  const positions: Record<string, [number, number, number]> = {};
  const radius = 12;

  // Arrange planets in a sphere
  planets.forEach((planet, index) => {
    const phi = Math.acos(-1 + (2 * index) / planets.length);
    const theta = Math.sqrt(planets.length * Math.PI) * phi;
    
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    
    positions[planet] = [x, y, z];
  });

  return positions;
}

// 3D Constellation Network Component
function ConstellationNetwork({
  planets,
  aspects,
  planetPositions,
  hoveredPlanet,
  hoveredAspect,
  onPlanetHover,
  onAspectHover,
  onPlanetClick,
}: {
  planets: string[];
  aspects: Aspect[];
  planetPositions: Record<string, [number, number, number]>;
  hoveredPlanet: string | null;
  hoveredAspect: Aspect | null;
  onPlanetHover: (planet: string | null) => void;
  onAspectHover: (aspect: Aspect | null) => void;
  onPlanetClick?: (planet: string) => void;
}) {
  return (
    <group>
      {/* Aspect lines */}
      {aspects.map((aspect, index) => (
        <AspectLine
          key={index}
          aspect={aspect}
          startPos={planetPositions[aspect.planetA]}
          endPos={planetPositions[aspect.planetB]}
          isHighlighted={
            hoveredPlanet === aspect.planetA || 
            hoveredPlanet === aspect.planetB ||
            hoveredAspect === aspect
          }
          isFaded={
            hoveredPlanet !== null && 
            hoveredPlanet !== aspect.planetA && 
            hoveredPlanet !== aspect.planetB
          }
          onHover={() => onAspectHover(aspect)}
          onLeave={() => onAspectHover(null)}
        />
      ))}

      {/* Planet nodes */}
      {planets.map((planet) => (
        <PlanetNode
          key={planet}
          planet={planet}
          position={planetPositions[planet]}
          isHighlighted={hoveredPlanet === planet}
          isFaded={hoveredPlanet !== null && hoveredPlanet !== planet}
          onHover={() => onPlanetHover(planet)}
          onLeave={() => onPlanetHover(null)}
          onClick={() => onPlanetClick?.(planet)}
        />
      ))}

      {/* Random light bursts at intersections */}
      <LightBursts aspects={aspects} planetPositions={planetPositions} />
    </group>
  );
}

// Planet Node Component
function PlanetNode({
  planet,
  position,
  isHighlighted,
  isFaded,
  onHover,
  onLeave,
  onClick,
}: {
  planet: string;
  position: [number, number, number];
  isHighlighted: boolean;
  isFaded: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Micro-circular breathing motion
      const time = clock.getElapsedTime();
      meshRef.current.position.x = position[0] + Math.sin(time * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.cos(time * 0.5) * 0.1;
      meshRef.current.rotation.z = time * 0.2;
    }
    
    if (glowRef.current) {
      const pulseSpeed = isHighlighted ? 2 : 1;
      const pulseIntensity = isHighlighted ? 0.3 : 0.15;
      glowRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * pulseSpeed) * pulseIntensity);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color={PLANET_COLORS[planet]}
          transparent
          opacity={isHighlighted ? 0.3 : isFaded ? 0.05 : 0.15}
        />
      </mesh>

      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onLeave();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={PLANET_COLORS[planet]}
          emissive={PLANET_COLORS[planet]}
          emissiveIntensity={isHighlighted ? 1.2 : isFaded ? 0.2 : 0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glyph sprite (2D text in 3D space) */}
      <sprite scale={[1.5, 1.5, 1]}>
        <spriteMaterial 
          opacity={isHighlighted ? 1 : isFaded ? 0.3 : 0.8}
          transparent
        />
      </sprite>
    </group>
  );
}

// Aspect Line Component
function AspectLine({
  aspect,
  startPos,
  endPos,
  isHighlighted,
  isFaded,
  onHover,
  onLeave,
}: {
  aspect: Aspect;
  startPos: [number, number, number];
  endPos: [number, number, number];
  isHighlighted: boolean;
  isFaded: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const style = ASPECT_STYLES[aspect.type];
  const pulseSpeed = style.pulse === 'fast' ? 3 : style.pulse === 'medium' ? 2 : 1;

  // Create line geometry
  const points = useMemo(() => [
    new THREE.Vector3(...startPos),
    new THREE.Vector3(...endPos),
  ], [startPos, endPos]);

  // Create particle positions along the line
  const particlePositions = useMemo(() => {
    const particleCount = 20;
    const positions: THREE.Vector3[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1);
      const x = startPos[0] + (endPos[0] - startPos[0]) * t;
      const y = startPos[1] + (endPos[1] - startPos[1]) * t;
      const z = startPos[2] + (endPos[2] - startPos[2]) * t;
      positions.push(new THREE.Vector3(x, y, z));
    }
    
    return positions;
  }, [startPos, endPos]);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const time = clock.getElapsedTime();
      
      // Pulsing opacity
      const baseOpacity = isHighlighted ? 0.9 : isFaded ? 0.1 : 0.5;
      material.opacity = baseOpacity + Math.sin(time * pulseSpeed) * 0.2;
    }

    if (particlesRef.current) {
      // Drift particles along the line
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < positions.length / 3; i++) {
        const t = (i / (positions.length / 3) + time * 0.1) % 1;
        positions[i * 3] = startPos[0] + (endPos[0] - startPos[0]) * t;
        positions[i * 3 + 1] = startPos[1] + (endPos[1] - startPos[1]) * t;
        positions[i * 3 + 2] = startPos[2] + (endPos[2] - startPos[2]) * t;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main line */}
      <line
        ref={lineRef}
        geometry={new THREE.BufferGeometry().setFromPoints(points)}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onLeave();
        }}
      >
        <lineBasicMaterial
          color={style.color}
          transparent
          linewidth={isHighlighted ? 3 : 1}
        />
      </line>

      {/* Traveling particles */}
      <points ref={particlesRef} geometry={new THREE.BufferGeometry().setFromPoints(particlePositions)}>
        <pointsMaterial
          color={style.color}
          size={0.15}
          transparent
          opacity={isHighlighted ? 0.8 : isFaded ? 0.1 : 0.4}
        />
      </points>
    </group>
  );
}

// Light Bursts at Intersections
function LightBursts({
  aspects,
  planetPositions,
}: {
  aspects: Aspect[];
  planetPositions: Record<string, [number, number, number]>;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * aspects.length);
      setActiveIndex(randomIndex);
      
      setTimeout(() => setActiveIndex(null), 1000);
    }, 12000);

    return () => clearInterval(interval);
  }, [aspects.length]);

  if (activeIndex === null) return null;

  const aspect = aspects[activeIndex];
  const midpoint: [number, number, number] = [
    (planetPositions[aspect.planetA][0] + planetPositions[aspect.planetB][0]) / 2,
    (planetPositions[aspect.planetA][1] + planetPositions[aspect.planetB][1]) / 2,
    (planetPositions[aspect.planetA][2] + planetPositions[aspect.planetB][2]) / 2,
  ];

  return (
    <LightBurst 
      position={midpoint} 
      color={ASPECT_STYLES[aspect.type].color}
    />
  );
}

function LightBurst({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.x += 0.1;
      meshRef.current.scale.y += 0.1;
      meshRef.current.scale.z += 0.1;
      
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity *= 0.95;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  );
}

// Interstellar Dust
function InterstellarDust({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Reduced from 100 to 50 particles for performance */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px rounded-full bg-white"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              mousePosition.x + (Math.random() - 0.5) * 300,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              mousePosition.y + (Math.random() - 0.5) * 300,
              Math.random() * window.innerHeight,
            ],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

// Planet Tooltip
function PlanetTooltip({ 
  planet, 
  mousePosition 
}: { 
  planet: string | null; 
  mousePosition: { x: number; y: number } 
}) {
  if (!planet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed pointer-events-none z-[100]"
      style={{
        left: mousePosition.x + 20,
        top: mousePosition.y + 20,
      }}
    >
      <div
        className="relative p-4 rounded-lg backdrop-blur-xl border"
        style={{
          backgroundColor: 'rgba(6, 6, 12, 0.95)',
          borderColor: `${PLANET_COLORS[planet]}40`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px ${PLANET_COLORS[planet]}20`,
        }}
      >
        <div className="text-2xl mb-1" style={{ color: PLANET_COLORS[planet] }}>
          {planet} — {PLANET_ARCHETYPES[planet]}
        </div>
        <div className="text-sm text-white/70 italic">
          {PLANET_ESSENCES[planet]}
        </div>
      </div>
    </motion.div>
  );
}

// Aspect Tooltip
function AspectTooltip({ 
  aspect, 
  mousePosition 
}: { 
  aspect: Aspect | null; 
  mousePosition: { x: number; y: number } 
}) {
  if (!aspect) return null;

  const style = ASPECT_STYLES[aspect.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed pointer-events-none z-[100]"
      style={{
        left: mousePosition.x + 20,
        top: mousePosition.y + 20,
      }}
    >
      <div
        className="relative p-4 rounded-lg backdrop-blur-xl border"
        style={{
          backgroundColor: 'rgba(6, 6, 12, 0.95)',
          borderColor: `${style.color}40`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px ${style.color}20`,
        }}
      >
        <div className="text-lg mb-1">
          <span style={{ color: PLANET_COLORS[aspect.planetA] }}>{aspect.planetA}</span>
          {' '}
          <span style={{ color: style.color }}>{style.verb}</span>
          {' '}
          <span style={{ color: PLANET_COLORS[aspect.planetB] }}>{aspect.planetB}</span>
        </div>
        <div className="text-sm text-white/70 capitalize">
          {style.keyword} energy
        </div>
        <div className="text-xs text-white/50 mt-1">
          Orb: {aspect.orb.toFixed(1)}° • Strength: {Math.round(aspect.strength * 100)}%
        </div>
      </div>
    </motion.div>
  );
}