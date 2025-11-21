import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from '../utils/three';

const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

interface ZodiacModel3DProps {
  zodiacIndex: number;
  position: [number, number, number];
  scale?: number;
  color?: string;
  rotationSpeed?: number;
  onClick?: () => void;
}

export function ZodiacModel3D({ 
  zodiacIndex, 
  position, 
  scale = 1, 
  color,
  rotationSpeed = 0.3,
  onClick
}: ZodiacModel3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const zodiacName = ZODIAC_SIGNS[zodiacIndex];
  const modelPath = `/models/${zodiacName}.glb`;

  // Try to load the GLB model
  // NOTE: This will fail in Figma Make environment since GLB upload isn't supported
  // Once you move this code to your own environment, place your GLB files in /models/
  let scene = null;
  let modelError = false;
  
  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
  } catch (error) {
    // Model not found - will render fallback silently
    modelError = true;
  }

  // Animate the model - gentle floating and rotation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle rotation
      groupRef.current.rotation.y += rotationSpeed * 0.01;
      
      // Subtle floating motion
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5 + zodiacIndex) * 0.15;
    }
  });

  // If model loaded successfully, render it
  if (scene && !modelError) {
    return (
      <group ref={groupRef} position={position} scale={scale} onClick={onClick} onPointerDown={onClick}>
        <primitive object={scene.clone()} />
        {color && (
          <pointLight color={color} intensity={0.5} distance={3} />
        )}
      </group>
    );
  }

  // Fallback: Render a placeholder 3D icon until models are added
  // This will show in Figma Make since GLB files can't be uploaded
  return (
    <group ref={groupRef} position={position} onClick={onClick} onPointerDown={onClick}>
      <mesh>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color || '#ffffff'}
          emissive={color || '#ffffff'}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color={color || '#ffffff'}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
      
      {/* Soft point light */}
      {color && (
        <pointLight color={color} intensity={0.3} distance={2} />
      )}
    </group>
  );
}

// Preload all zodiac models when component mounts
// This prevents loading hitches during runtime
export function preloadZodiacModels() {
  ZODIAC_SIGNS.forEach(sign => {
    try {
      useGLTF.preload(`/models/${sign}.glb`);
    } catch (error) {
      // Model not available yet - silently continue
    }
  });
}