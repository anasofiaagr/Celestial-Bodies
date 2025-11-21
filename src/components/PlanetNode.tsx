import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from '../utils/three';
import { motion } from 'motion/react';
import { getPlanetArchetypeName, getPlanetTooltipData } from '../utils/fluidAstrologyMappings';

interface PlanetNodeProps {
  basePosition: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
  planetName: string;
  viewMode?: 'overview' | 'layer' | 'planet'; // Add view mode
  isFocusedLayer?: boolean; // Is this planet's layer focused
  isNearCusp?: boolean; // Is planet within 5° of next house cusp
  degreesToNextCusp?: number; // Exact degrees to next cusp
}

export default function PlanetNode({ 
  basePosition, 
  orbitRadius, 
  orbitSpeed, 
  color, 
  isActive = false, 
  onClick,
  planetName,
  viewMode = 'overview',
  isFocusedLayer = false,
  isNearCusp = false,
  degreesToNextCusp = 0
}: PlanetNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get Fluid Astrology archetype name
  const archetypeName = getPlanetArchetypeName(planetName);
  const tooltipData = getPlanetTooltipData(planetName);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Position relative to the group (which is already at basePosition)
      // Just gentle pulsing in place
      const pulseOffset = Math.sin(time * orbitSpeed) * 0.05; // Very subtle vertical pulse
      meshRef.current.position.x = 0;
      meshRef.current.position.y = pulseOffset;
      meshRef.current.position.z = 0;
      
      // Gentle rotation
      meshRef.current.rotation.y = time * 0.5;
    }
    
    if (glowRef.current) {
      const pulseSpeed = isActive ? 2 : 1;
      const pulseIntensity = isActive ? 0.3 : 0.15;
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * pulseSpeed) * pulseIntensity);
    }
  });

  return (
    <>
      <group position={basePosition}>
        {/* Near-Cusp Warning Ring - shows when planet is within 5° of house cusp */}
        {isNearCusp && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.55, 32]} />
            <meshBasicMaterial 
              color="#FFD700"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
        
        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={isActive ? 0.4 : isHovered ? 0.3 : 0.2}
          />
        </mesh>

        {/* Invisible larger click target for easier clicking */}
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsHovered(true);
            // Show tooltip after a delay (only if hovering, not clicking)
            hoverTimeoutRef.current = setTimeout(() => {
              setShowTooltip(true);
            }, 500); // 500ms delay before showing tooltip
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setIsHovered(false);
            setShowTooltip(false);
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(false); // Hide tooltip immediately on click
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            onClick?.();
          }}
        >
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshBasicMaterial 
            transparent
            opacity={0}
          />
        </mesh>
        
        {/* Planet sphere (visual only, no interaction) */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={isActive ? 1.2 : isHovered ? 0.8 : 0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Hover label with Fluid Astrology archetype name - only show after delay */}
      {showTooltip && (
        <Html position={[basePosition[0], basePosition[1] + 0.5, basePosition[2]]} center zIndexRange={[0, 50]} sprite>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none"
          >
            <div
              className="px-4 py-3 rounded-xl backdrop-blur-xl border-2"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(10, 10, 20, 0.9))',
                borderColor: isNearCusp ? '#FFD700' : `${color}80`,
                boxShadow: isNearCusp 
                  ? `0 8px 32px #FFD70060, 0 0 40px #FFD70030`
                  : `0 8px 32px ${color}60, 0 0 40px ${color}30`,
                minWidth: '200px'
              }}
            >
              {/* Near Cusp Warning */}
              {isNearCusp && (
                <div
                  className="text-xs mb-2 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/40"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 0 8px #FFD70060',
                  }}
                >
                  ⚠️ Near Cusp: {degreesToNextCusp.toFixed(1)}° to next house
                </div>
              )}

              {/* Archetype name */}
              <div
                className="text-sm mb-2 tracking-wide"
                style={{
                  color: color,
                  textShadow: `0 0 10px ${color}60`,
                }}
              >
                {archetypeName}
              </div>

              {/* Traditional planet name */}
              <div className="text-xs text-white/60 italic mb-2">
                Traditional: {planetName}
              </div>

              {/* Tooltip title */}
              <div className="text-xs text-white/70 mb-2">
                {tooltipData.title}
              </div>

              {/* Archetype essence */}
              <div className="text-xs text-white/60 italic mb-2">
                {tooltipData.archetypeName}
              </div>

              {/* Essence keywords */}
              <div className="text-xs text-white/50">
                Essence: {tooltipData.essence}
              </div>

              {/* Fluid Astrology note */}
              <div className="text-xs text-purple-300/70 italic leading-relaxed pt-2 mt-2 border-t border-white/10">
                {tooltipData.note}
              </div>
            </div>
          </motion.div>
        </Html>
      )}

      {/* Persistent label in House Layer View */}
      {!isHovered && viewMode === 'layer' && isFocusedLayer && (
        <Html position={[basePosition[0], basePosition[1] + 0.6, basePosition[2]]} center zIndexRange={[0, 50]} sprite>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="pointer-events-none"
          >
            <div
              className="px-3 py-1.5 rounded-lg backdrop-blur-lg border"
              style={{
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                borderColor: `${color}60`,
                boxShadow: `0 4px 16px ${color}40`,
              }}
            >
              <div
                className="text-xs tracking-wide whitespace-nowrap"
                style={{
                  color: 'white',
                  textShadow: `0 0 8px ${color}40`,
                }}
              >
                {archetypeName}
              </div>
            </div>
          </motion.div>
        </Html>
      )}
    </>
  );
}