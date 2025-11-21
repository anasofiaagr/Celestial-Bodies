import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from '../../utils/three';
import { motion } from 'motion/react';
import type { GlossaryItem, GlossaryCategory } from '../../contexts/GlossaryContext';

interface GlossaryConstellation3DProps {
  item: GlossaryItem;
  category: GlossaryCategory;
  index: number;
  position: [number, number, number];
  color?: string;
  onDeepView: () => void;
}

export function GlossaryConstellation3D({
  item,
  category,
  index,
  position,
  color = '#ffffff',
  onDeepView,
}: GlossaryConstellation3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Generate a small constellation pattern (3-5 stars)
  const starPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const numStars = 4 + Math.floor(Math.random() * 3); // 4-6 stars
    
    for (let i = 0; i < numStars; i++) {
      const angle = (i / numStars) * Math.PI * 2;
      const radius = 0.4 + Math.random() * 0.3; // Much larger radius
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.3;
      const z = Math.sin(angle) * radius;
      positions.push([x, y, z]);
    }
    return positions;
  }, []);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05;
      groupRef.current.rotation.y = time * 0.1;
    }
  });

  // Determine display name based on category
  const displayName = 
    category === 'planets' 
      ? item.archetype_name || item.name || item.term || `Item ${index + 1}`
      : category === 'zodiac_signs'
        ? item.fusion_label || item.name || item.term || `Item ${index + 1}`
        : item.name || item.term || `Item ${index + 1}`;

  const shortDescription = item.essence || item.description || '';
  const keywords = item.keywords?.slice(0, 3).join(' • ') || '';

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Star nodes */}
      {starPositions.map((pos, i) => (
        <group key={i}>
          {/* Main star sphere */}
          <mesh
            position={pos}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              onDeepView();
            }}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isHovered ? 1 : 0.9}
            />
          </mesh>
          
          {/* Outer glow sphere */}
          <mesh position={pos}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isHovered ? 0.5 : 0.3}
            />
          </mesh>
          
          {/* Point light for glow */}
          <pointLight 
            position={pos}
            color={color} 
            intensity={isHovered ? 2 : 1} 
            distance={1.5} 
          />
        </group>
      ))}

      {/* Connecting lines between stars - using Line from drei */}
      {starPositions.map((pos, i) => {
        if (i === starPositions.length - 1) return null;
        const nextPos = starPositions[i + 1];

        return (
          <group key={`line-${i}`}>
            {/* Main line */}
            <mesh>
              <tubeGeometry args={[
                new THREE.CatmullRomCurve3([
                  new THREE.Vector3(...pos),
                  new THREE.Vector3(...nextPos)
                ]),
                20,
                0.04,
                8,
                false
              ]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isHovered ? 0.9 : 0.7}
              />
            </mesh>
            {/* Glow line */}
            <mesh>
              <tubeGeometry args={[
                new THREE.CatmullRomCurve3([
                  new THREE.Vector3(...pos),
                  new THREE.Vector3(...nextPos)
                ]),
                20,
                0.08,
                8,
                false
              ]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isHovered ? 0.4 : 0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Closing line to form constellation */}
      {starPositions.length > 2 && (
        <group>
          {/* Main line */}
          <mesh>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(...starPositions[starPositions.length - 1]),
                new THREE.Vector3(...starPositions[0])
              ]),
              20,
              0.04,
              8,
              false
            ]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isHovered ? 0.9 : 0.7}
            />
          </mesh>
          {/* Glow line */}
          <mesh>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(...starPositions[starPositions.length - 1]),
                new THREE.Vector3(...starPositions[0])
              ]),
              20,
              0.08,
              8,
              false
            ]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isHovered ? 0.4 : 0.2}
            />
          </mesh>
        </group>
      )}

      {/* HTML Tooltip on hover */}
      {isHovered && (
        <Html
          position={[0, 0.3, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-56 pointer-events-none"
          >
            <div
              className="rounded-lg p-3 backdrop-blur-md border border-white/20 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${color}20, ${color}05)`,
              }}
            >
              <div className="text-xs font-medium text-white/90 mb-1">
                {displayName}
              </div>
              {shortDescription && (
                <div className="text-xs text-white/70 leading-relaxed mb-2">
                  {shortDescription}
                </div>
              )}
              {keywords && (
                <div className="text-[10px] text-white/50 italic">
                  {keywords}
                </div>
              )}
              <div className="text-[10px] text-white/40 mt-2 border-t border-white/10 pt-2">
                Click for deep view
              </div>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
}