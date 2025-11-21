import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line, Html, OrbitControls } from '@react-three/drei';
import * as THREE from '../utils/three';
import PlanetNode from './PlanetNode';
import { HouseStarCues } from './HouseStarCues';
import { ZodiacModel3D } from './ZodiacModel3D';
import FusionLabel from './FusionLabel';
import { GlossaryConstellationUI } from './glossary/GlossaryConstellationUI';
import { getPlanetDistribution, PLANET_NAMES } from '../utils/planetDistribution';
import { getHouseName } from '../utils/fluidAstrologyMappings';
import type { EnrichedChart } from '../utils/ChartEnricher';
import type { ViewMode } from '../hooks/useContextualGlossary';

// CANONICAL planet name array - DO NOT MODIFY
// This must match the order in sentence templates and poetic overlays
const CANONICAL_PLANET_NAMES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
] as const;

interface SpiralProps {
  chart: EnrichedChart | null;
  focusedHouse: {
    layerIndex: number;
    planetIndex?: number;
    position: [number, number, number];
  } | null;
  onPlanetClick: (layerIndex: number, planetIndex: number, position: [number, number, number]) => void;
  onLayerClick: (layerIndex: number) => void;
  isFlatView: boolean;
  onLogCameraPosition?: () => void;
  isConstellationMode?: boolean;
  hoveredPlanetForAspects?: { layerIndex: number; planetIndex: number } | null;
  onAspectClick?: (aspectData: any) => void;
  focusedAspect?: any;
  viewMode?: ViewMode;
}

const TOTAL_LAYERS = 12;
const POINTS_PER_LAYER = 100;
const TOTAL_POINTS = TOTAL_LAYERS * POINTS_PER_LAYER;
const HEIGHT = 26;
const START_RADIUS = 2.5; // House 1 starts small at top
const END_RADIUS = 5.5;   // House 12 ends large at bottom
const TOTAL_PLANETS = 10; // Total planets across all layers

export const HOUSE_COLORS = [
  '#F94144', '#F3722C', '#F8961E', '#F9C74F',
  '#90BE6D', '#43AA8B', '#577590', '#277DA1',
  '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Astrological aspects with colors
const ASPECTS = {
  Conjunction: { angle: 0, color: '#FFD700', orb: 10, description: 'Union, fusion, concentrated power' },
  Sextile: { angle: 60, color: '#00C4CC', orb: 6, description: 'Harmony, opportunity, ease' },
  Square: { angle: 90, color: '#D72638', orb: 8, description: 'Tension, challenge, activation' },
  Trine: { angle: 120, color: '#4CAF50', orb: 8, description: 'Flow, talent, balance' },
  Opposition: { angle: 180, color: '#3F51B5', orb: 10, description: 'Polarity, confrontation, reflection' },
};

export function Spiral({ chart, focusedHouse, onPlanetClick, onLayerClick, isFlatView, onLogCameraPosition, isConstellationMode, hoveredPlanetForAspects, onAspectClick, focusedAspect, viewMode }: SpiralProps) {
  const spiralRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>();
  const { camera } = useThree();
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const [hoveredAspectIndex, setHoveredAspectIndex] = useState<number | null>(null);
  const [constellationTransition, setConstellationTransition] = useState(0);
  
  // Animate constellation mode transition
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const targetTransition = isConstellationMode ? 1 : 0;
    
    // Smooth 4-second transition
    if (constellationTransition !== targetTransition) {
      const transitionSpeed = delta / 4; // 4 seconds total
      const newTransition = constellationTransition + (targetTransition > constellationTransition ? transitionSpeed : -transitionSpeed);
      setConstellationTransition(Math.max(0, Math.min(1, newTransition)));
    }

    // Smooth rotation with quaternion interpolation for stable transitions
    if (spiralRef.current) {
      const targetRotation = isFlatView
        ? new THREE.Euler(-Math.PI / 2, 0, 0)  // Lay flat on XZ plane (rotated for bottom view - looking up at House 12)
        : new THREE.Euler(0, 0, 0);            // Upright spiral

      // Smoothly interpolate rotation using quaternions for better stability
      spiralRef.current.quaternion.slerp(
        new THREE.Quaternion().setFromEuler(targetRotation),
        0.1
      );
    }

    // Camera animation
    if (cameraAnimation && cameraAnimation.progress < 1) {
      // Much slower speeds for natural, smooth movement
      const speed = cameraAnimation.isZipline 
        ? 0.003  // Slow zipline for cinematic gliding
        : focusedHouse === null 
          ? 0.005  // Medium speed returning to overview
          : 0.004; // Slow initial zoom into layer
      
      const newProgress = Math.min(1, cameraAnimation.progress + speed);

      // Smooth easing function - ease out quart for natural deceleration
      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
      const easeInOutQuart = (t: number) => 
        t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
      
      // Use gentler easing for zipline, stronger for direct movements
      const easedProgress = cameraAnimation.isZipline 
        ? easeInOutQuart(newProgress)
        : easeOutQuart(newProgress);

      if (cameraAnimation.isZipline && cameraAnimation.path.length > 1) {
        // ZIPLINE MODE: Interpolate through path waypoints
        const pathLength = cameraAnimation.path.length - 1;
        const pathProgress = easedProgress * pathLength;
        const segmentIndex = Math.floor(pathProgress);
        const segmentT = pathProgress - segmentIndex;
        
        const clampedIndex = Math.min(segmentIndex, pathLength - 1);
        const currentWP = cameraAnimation.path[clampedIndex];
        const nextWP = cameraAnimation.path[clampedIndex + 1];

        // Ultra-smooth interpolation within segment using ease-in-out-quint
        const smoothT = segmentT < 0.5 
          ? 16 * segmentT * segmentT * segmentT * segmentT * segmentT
          : 1 - Math.pow(-2 * segmentT + 2, 5) / 2;
        
        // Calculate target position along the path
        const pathTargetPos = new THREE.Vector3().lerpVectors(currentWP.pos, nextWP.pos, smoothT);
        const pathTargetLookAt = new THREE.Vector3().lerpVectors(currentWP.target, nextWP.target, smoothT);

        // Blend from start position at beginning of animation
        const blendFactor = Math.min(easedProgress * 3, 1); // Quick blend in first 33%
        const finalTargetPos = new THREE.Vector3().lerpVectors(
          cameraAnimation.start.pos,
          pathTargetPos,
          blendFactor
        );
        const finalTargetLookAt = new THREE.Vector3().lerpVectors(
          cameraAnimation.start.target,
          pathTargetLookAt,
          blendFactor
        );

        // Damped movement for extra smoothness - no jumping
        camera.position.lerp(finalTargetPos, 0.18);
        
        const currentLookAt = controlsRef.current?.target || new THREE.Vector3();
        const smoothTarget = new THREE.Vector3().copy(currentLookAt).lerp(finalTargetLookAt, 0.18);
        camera.lookAt(smoothTarget);

        if (controlsRef.current) {
          controlsRef.current.target.lerp(finalTargetLookAt, 0.18);
          controlsRef.current.update();
        }
      } else {
        // DIRECT MODE: Smooth interpolation with damping
        const targetPos = new THREE.Vector3().lerpVectors(
          cameraAnimation.start.pos,
          cameraAnimation.end.pos,
          easedProgress
        );
        const targetLookAt = new THREE.Vector3().lerpVectors(
          cameraAnimation.start.target,
          cameraAnimation.end.target,
          easedProgress
        );

        // Apply damping for natural spring-like motion - no jumping
        camera.position.lerp(targetPos, 0.15);
        
        const currentLookAt = controlsRef.current?.target || new THREE.Vector3();
        const smoothTarget = new THREE.Vector3().copy(currentLookAt).lerp(targetLookAt, 0.15);
        camera.lookAt(smoothTarget);

        if (controlsRef.current) {
          controlsRef.current.target.lerp(targetLookAt, 0.15);
          controlsRef.current.update();
        }
      }

      setCameraAnimation(prev => prev ? { ...prev, progress: newProgress } : null);
      
      // Log camera position every 20% of animation
      if (Math.floor(newProgress * 5) !== Math.floor((newProgress - speed) * 5)) {
        console.log(`🎬 Animation ${Math.round(newProgress * 100)}%:`, 
          'Pos:', camera.position.toArray().map(v => v.toFixed(2)),
          'LookAt:', (controlsRef.current?.target.toArray() || [0, 0, 0]).map(v => v.toFixed(2))
        );
      }
    } else if (cameraAnimation && cameraAnimation.progress >= 1) {
      setCameraAnimation(null);
      console.log('✅ Animation Complete!');
      console.log('📍 Final Camera Position:', camera.position.toArray().map(v => v.toFixed(2)));
      console.log('👁️  Final LookAt:', (controlsRef.current?.target.toArray() || [0, 0, 0]).map(v => v.toFixed(2)));
    }
  });

  // Expose camera position logging function
  useEffect(() => {
    if (onLogCameraPosition) {
      // Override the callback with our logging function
      const logPosition = () => {
        console.log('📸 ===== CURRENT CAMERA POSITION =====');
        console.log('📍 Position:', camera.position.toArray().map(v => v.toFixed(2)));
        console.log('👁️  LookAt:', (controlsRef.current?.target.toArray() || [0, 0, 0]).map(v => v.toFixed(2)));
        console.log('🎭 View Mode:', isFlatView ? 'FLAT VIEW' : 'FUNNEL VIEW');
        console.log('=====================================');
      };
      // Make it available globally
      (window as any).__logCameraPosition = logPosition;
    }
  }, [camera, isFlatView, onLogCameraPosition]);

  const [cameraAnimation, setCameraAnimation] = useState<{
    start: { pos: THREE.Vector3; target: THREE.Vector3 };
    end: { pos: THREE.Vector3; target: THREE.Vector3 };
    path: Array<{ pos: THREE.Vector3; target: THREE.Vector3 }>;
    progress: number;
    isZipline: boolean;
  } | null>(null);

  // Force enable controls on mount and when animation completes
  useEffect(() => {
    if (controlsRef.current) {
      console.log('🎮 OrbitControls initialized, enabled:', controlsRef.current.enabled);
      // Force enable on mount
      controlsRef.current.enabled = true;
    }
  }, []);

  // Debug camera animation state changes
  useEffect(() => {
    if (cameraAnimation) {
      console.log('🎬 Camera animation started, OrbitControls disabled');
    } else {
      console.log('✅ Camera animation ended, OrbitControls should be enabled');
      // Force re-enable controls
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        console.log('🎮 OrbitControls force-enabled:', controlsRef.current.enabled);
      }
    }
  }, [cameraAnimation]);

  // Generate continuous helical spiral with metadata
  const spiralData = useMemo(() => {
    const segments = [];
    const layerMetadata = [];
    const cameraWaypoints: Array<{ pos: THREE.Vector3; target: THREE.Vector3; layer: number }> = [];

    // Generate continuous spiral line segments by layer
    for (let layer = 0; layer < TOTAL_LAYERS; layer++) {
      const layerPoints: [number, number, number][] = [];

      for (let i = 0; i < POINTS_PER_LAYER; i++) {
        const t = (layer * POINTS_PER_LAYER + i) / TOTAL_POINTS;
        const angle = t * Math.PI * 2 * TOTAL_LAYERS;
        const radius = START_RADIUS + t * (END_RADIUS - START_RADIUS); // Grows from small to large
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = HEIGHT / 2 - t * HEIGHT; // Start at top, go down
        layerPoints.push([x, y, z]);
      }

      segments.push({ points: layerPoints, color: HOUSE_COLORS[layer], layer });

      // Calculate layer center point - this will be the lookAt target
      const layerT = (layer + 0.5) / TOTAL_LAYERS;
      const layerAngle = layerT * Math.PI * 2 * TOTAL_LAYERS;
      const layerRadius = START_RADIUS + layerT * (END_RADIUS - START_RADIUS); // Grows from small to large
      const centerHeight = HEIGHT / 2 - layerT * HEIGHT; // Start at top, go down
      
      // Center point of the layer (average of all points in this layer ring)
      // This ensures the layer is perfectly centered in view
      const centerX = 0; // Center at origin X
      const centerZ = 0; // Center at origin Z
      const centerY = centerHeight; // At the layer's height

      // Camera position: positioned outside for external perspective
      const camDistance = 12; // Distance from center
      const camHeightOffset = 4; // Height offset for viewing angle
      const camAngle = layerAngle + Math.PI * 0.6; // Offset angle for dynamic view
      const camX = Math.cos(camAngle) * camDistance;
      const camY = centerY + camHeightOffset;
      const camZ = Math.sin(camAngle) * camDistance;

      cameraWaypoints.push({
        pos: new THREE.Vector3(camX, camY, camZ),
        target: new THREE.Vector3(centerX, centerY, centerZ),
        layer,
      });

      layerMetadata.push({ layer, planets: [], centerY });
    }

    // Use REAL chart data if available, otherwise fall back to random distribution
    if (chart && chart.planets && chart.planets.length > 0) {
      console.log('�� Using REAL planet positions from API chart data');
      console.log('📊 Chart Houses:');
      chart.houses.forEach(h => {
        console.log(`   House ${h.id}: ${h.sign} cusp at ${h.cusp_degree.toFixed(2)}°`);
      });
      
      console.log('📊 Planets from API:');
      console.log('   Total planets:', chart.planets.length);
      chart.planets.forEach((p, i) => {
        console.log(`   ${i}: enrichedPlanet.planet.name = "${p.planet.name}", enrichedPlanet.api.name = "${p.api.name}"`);
      });
      
      console.log('📊 PLANET_NAMES array:', PLANET_NAMES);
      
      console.log('📊 Planets:');
      
      // Helper function to determine which house a planet is in based on its degree
      const findHouseForDegree = (degree: number): number => {
        // Normalize degree to 0-360
        const normalizedDegree = ((degree % 360) + 360) % 360;
        
        // For each house, check if the planet falls between this cusp and the next
        for (let i = 0; i < 12; i++) {
          const currentHouse = chart.houses[i];
          const nextHouse = chart.houses[(i + 1) % 12];
          
          const currentCusp = currentHouse.cusp_degree;
          const nextCusp = nextHouse.cusp_degree;
          
          // Check if planet is between this cusp and the next
          // Handle wrap-around at 360°/0°
          if (currentCusp < nextCusp) {
            // Normal case: e.g., House 1 at 120°, House 2 at 150°
            if (normalizedDegree >= currentCusp && normalizedDegree < nextCusp) {
              return currentHouse.id;
            }
          } else {
            // Wrap-around case: e.g., House 12 at 330°, House 1 at 30°
            if (normalizedDegree >= currentCusp || normalizedDegree < nextCusp) {
              return currentHouse.id;
            }
          }
        }
        
        // Fallback: return API house_id if no match found
        return 1;
      };
      
      // Map each planet from the chart to its correct position
      chart.planets.forEach((enrichedPlanet, index) => {
        const absoluteDegree = enrichedPlanet.api.degree; // Absolute ecliptic degree (0-360)
        
        // Calculate which house the planet is ACTUALLY in based on degree
        const actualHouseId = findHouseForDegree(absoluteDegree);
        const apiHouseId = enrichedPlanet.api.house_id;
        
        // Log if there's a mismatch
        if (actualHouseId !== apiHouseId) {
          console.log(`   ⚠️ House mismatch for ${enrichedPlanet.planet.name}: API says House ${apiHouseId}, degree ${absoluteDegree.toFixed(1)}° suggests House ${actualHouseId}`);
        }
        
        // Use the CALCULATED house, not the API's house_id
        const houseId = actualHouseId;
        const layerIndex = houseId - 1; // Convert to 0-11 for array indexing
        
        // The spiral represents the entire 360° zodiac wheel
        // House 1 cusp (Ascendant) should be at a specific point on the spiral
        // Each layer represents one house
        
        // Get the Ascendant degree (House 1 cusp)
        const ascendantDegree = chart.houses.find(h => h.id === 1)?.cusp_degree || 0;
        
        // Find this house's cusp degree
        const houseCuspDegree = chart.houses.find(h => h.id === houseId)?.cusp_degree || 0;
        
        // Calculate the planet's degree relative to this house cusp
        let degreeFromCusp = absoluteDegree - houseCuspDegree;
        if (degreeFromCusp < 0) {
          degreeFromCusp += 360; // Handle wrap-around
        }
        if (degreeFromCusp > 180) {
          // Planet is likely in previous house, wrap the other way
          degreeFromCusp -= 360;
        }
        
        // Get next house cusp to calculate house size
        const nextHouseId = (houseId % 12) + 1;
        const nextHouseCusp = chart.houses.find(h => h.id === nextHouseId)?.cusp_degree || (houseCuspDegree + 30);
        
        let houseSize = nextHouseCusp - houseCuspDegree;
        if (houseSize <= 0) {
          houseSize += 360; // Handle wrap
        }
        
        // Ensure the planet degree is actually within this house
        if (degreeFromCusp < 0 || degreeFromCusp > houseSize) {
          console.warn(`⚠️ Planet ${enrichedPlanet.planet.name} at ${absoluteDegree}° may not be in House ${houseId} (cusp at ${houseCuspDegree}°)`);
          // Clamp to house boundaries
          degreeFromCusp = Math.max(0, Math.min(houseSize, degreeFromCusp));
        }
        
        // Calculate progress through the house (0 = at cusp, 1 = at next cusp)
        const progressThroughHouse = degreeFromCusp / houseSize;
        
        // Check if planet is near the next house cusp (within 5 degrees)
        const degreesToNextCusp = houseSize - degreeFromCusp;
        const isNearCusp = degreesToNextCusp <= 5;
        
        // Map to spiral position
        // Each house gets one full rotation of the spiral (2π radians)
        // The spiral parameter t goes from 0 to 1 across all 12 layers
        const t = (layerIndex + progressThroughHouse) / TOTAL_LAYERS;
        
        // The angle rotates 12 full times (one per layer)
        const angle = t * Math.PI * 2 * TOTAL_LAYERS;
        
        // Radius grows linearly from START_RADIUS to END_RADIUS
        const radius = START_RADIUS + t * (END_RADIUS - START_RADIUS);
        
        // Position on spiral
        const px = Math.cos(angle) * radius;
        const pz = Math.sin(angle) * radius;
        const py = HEIGHT / 2 - t * HEIGHT; // Top to bottom
        
        console.log(`   ${enrichedPlanet.planet.name}: ${absoluteDegree.toFixed(1)}° in ${enrichedPlanet.sign.name} → House ${houseId} (${(progressThroughHouse * 100).toFixed(0)}% through house)`);
        
        // Find the correct global index for this planet name using CANONICAL array
        const planetName = enrichedPlanet.planet.name;
        const globalIndex = CANONICAL_PLANET_NAMES.findIndex(p => p.toLowerCase() === planetName.toLowerCase());
        
        if (globalIndex < 0) {
          console.warn(`   ⚠️ WARNING: Planet "${planetName}" not found in CANONICAL_PLANET_NAMES array! This will cause index mismatch.`);
        }
        
        console.log(`   🔍 DEBUG: Planet "${planetName}" → globalIndex: ${globalIndex} (CANONICAL_PLANET_NAMES: [${CANONICAL_PLANET_NAMES.join(', ')}])`);
        
        layerMetadata[layerIndex].planets.push({
          basePosition: [px, py, pz] as [number, number, number],
          orbitRadius: 0.35,
          orbitSpeed: 0.4 + Math.random() * 0.6,
          globalIndex: globalIndex >= 0 ? globalIndex : index, // Use CANONICAL index, fallback to array index
          planetName: enrichedPlanet.planet.name,
          isNearCusp: isNearCusp,
          degreesToNextCusp: degreesToNextCusp,
          degreeInSign: absoluteDegree % 30, // Degree within current sign (0-30)
        });
      });
      
      console.log('✅ Planet positioning complete');
    } else {
      // Fallback: Distribute 10 total planets across all 12 layers using random distribution
      console.log('⚠️ No chart data available, using RANDOM planet distribution');
      const planetDistribution = getPlanetDistribution();
      
      for (const [layer, planetIndices] of Object.entries(planetDistribution)) {
        const layerIndex = parseInt(layer);
        planetIndices.forEach((planetIndex: number) => {
          const planetRadius = START_RADIUS + (layerIndex / TOTAL_LAYERS) * (END_RADIUS - START_RADIUS);
          const planetAngle = (planetIndex / TOTAL_PLANETS) * Math.PI * 2 + layerIndex * 0.3;
          const px = Math.cos(planetAngle) * planetRadius;
          const pz = Math.sin(planetAngle) * planetRadius;
          const py = HEIGHT / 2 - (layerIndex / TOTAL_LAYERS) * HEIGHT;
          
          layerMetadata[layerIndex].planets.push({
            basePosition: [px, py, pz] as [number, number, number],
            orbitRadius: 0.35,
            orbitSpeed: 0.4 + Math.random() * 0.6,
            globalIndex: planetIndex,
          });
        });
      }
    }

    return { segments, layerMetadata, cameraWaypoints };
  }, [chart]);

  // Track the last focused layer to detect zipline scenarios
  const lastFocusedLayerRef = useRef<number | null>(null);
  const previousViewModeRef = useRef<boolean>(isFlatView);

  // Handle view mode change - reset camera position
  useEffect(() => {
    // Only trigger if view mode actually changed
    if (previousViewModeRef.current !== isFlatView) {
      previousViewModeRef.current = isFlatView;
      
      const targetPos = isFlatView
        ? new THREE.Vector3(-2.72, -33.33, -4.52) // Fixed angled view from below
        : new THREE.Vector3(0, 0, 20); // Side view

      const targetLookAt = new THREE.Vector3(0, 0, 0); // Always center

      console.log('🎥 VIEW MODE CHANGE:', isFlatView ? 'FLAT VIEW' : 'FUNNEL VIEW');
      console.log('📍 Target Camera Position:', targetPos.toArray());
      console.log('👁️  Target LookAt:', targetLookAt.toArray());
      console.log('📍 Current Camera Position:', camera.position.toArray());

      setCameraAnimation({
        start: {
          pos: camera.position.clone(),
          target: controlsRef.current?.target.clone() || new THREE.Vector3(0, 0, 0),
        },
        end: {
          pos: targetPos,
          target: targetLookAt,
        },
        path: [],
        progress: 0,
        isZipline: false,
      });
    }
  }, [isFlatView, camera]);

  // Handle focus changes
  useEffect(() => {
    if (!focusedHouse) {
      // Return to overview - use appropriate position based on view mode
      const overviewPos = isFlatView 
        ? new THREE.Vector3(-2.72, -33.33, -4.52)  // Fixed angled view from below
        : new THREE.Vector3(0, 0, 20);  // Side view for vertical
        
      setCameraAnimation({
        start: {
          pos: camera.position.clone(),
          target: controlsRef.current?.target.clone() || new THREE.Vector3(0, 0, 0),
        },
        end: {
          pos: overviewPos,
          target: new THREE.Vector3(0, 0, 0),
        },
        path: [],
        progress: 0,
        isZipline: false,
      });
      lastFocusedLayerRef.current = null;
    } else {
      const targetLayer = focusedHouse.layerIndex;
      const previousLayer = lastFocusedLayerRef.current;

      // Check if we're focusing on a specific planet
      if (focusedHouse.planetIndex !== undefined && focusedHouse.position) {
        // PLANET ZOOM: Focus directly on the planet node
        const planetPosition = new THREE.Vector3(...focusedHouse.position);
        
        // Calculate camera position offset from planet for nice viewing angle
        const offset = isFlatView 
          ? new THREE.Vector3(4, 2, 4)   // Closer, angled view in flat mode
          : new THREE.Vector3(3, 1.5, 6); // Side-angled view in funnel mode
        
        const cameraPos = planetPosition.clone().add(offset);
        
        console.log('🌍 PLANET FOCUS: Zooming to planet', {
          planetIndex: focusedHouse.planetIndex,
          planetPosition: focusedHouse.position,
          cameraPos: cameraPos.toArray(),
        });

        setCameraAnimation({
          start: {
            pos: camera.position.clone(),
            target: controlsRef.current?.target.clone() || new THREE.Vector3(0, 0, 0),
          },
          end: {
            pos: cameraPos,
            target: planetPosition.clone(),
          },
          path: [],
          progress: 0,
          isZipline: false,
        });
      } else {
        // LAYER FOCUS: Focus on the house layer
        const targetWaypoint = spiralData.cameraWaypoints[targetLayer];

        // Check if we're transitioning between layers (zipline case)
        if (previousLayer !== null && previousLayer !== targetLayer) {
          // ZIPLINE: Build smooth path through all intermediate layers
          const startIdx = previousLayer;
          const endIdx = targetLayer;
          const direction = endIdx > startIdx ? 1 : -1;
          const path: Array<{ pos: THREE.Vector3; target: THREE.Vector3 }> = [];

          // Build path including start and end
          for (let i = startIdx; direction > 0 ? i <= endIdx : i >= endIdx; i += direction) {
            const wp = spiralData.cameraWaypoints[i];
            path.push({ pos: wp.pos.clone(), target: wp.target.clone() });
          }

          // Start from current camera position for seamless transition
          setCameraAnimation({
            start: { pos: camera.position.clone(), target: controlsRef.current?.target.clone() || new THREE.Vector3() },
            end: { pos: targetWaypoint.pos.clone(), target: targetWaypoint.target.clone() },
            path,
            progress: 0,
            isZipline: true,
          });
        } else {
          // INITIAL ZOOM: Direct camera movement to layer
          setCameraAnimation({
            start: {
              pos: camera.position.clone(),
              target: controlsRef.current?.target.clone() || new THREE.Vector3(0, 0, 0),
            },
            end: {
              pos: targetWaypoint.pos.clone(),
              target: targetWaypoint.target.clone(),
            },
            path: [],
            progress: 0,
            isZipline: false,
          });
        }
      }

      lastFocusedLayerRef.current = targetLayer;
    }
  }, [focusedHouse, spiralData.cameraWaypoints, isFlatView, camera]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
        enablePan={false}
        enableZoom={isFlatView ? false : true} // Disable zoom in flat view
        enableRotate={isFlatView ? false : true} // Disable rotation in flat view
        minDistance={6}
        maxDistance={35}
        maxPolarAngle={Math.PI * 0.95}
        minPolarAngle={Math.PI * 0.05}
        touches={{
          ONE: 0, // one-finger: rotate
          TWO: 1  // two-finger pinch: zoom
        }}
        enabled={!cameraAnimation} // Disable during camera animation
      />

      <group ref={spiralRef}>
        {/* Continuous helical spiral lines */}
        {spiralData.segments.map(({ points, color, layer }) => {
          const isActive = focusedHouse?.layerIndex === layer;
          const isHovered = hoveredLayer === layer;
          const isFocused = focusedHouse !== null;
          const isPlanetFocus = focusedHouse?.planetIndex !== undefined;
          
          // Enhanced dimming logic - dim MORE when focused on planet OR in constellation mode
          const isDimmed = (hoveredLayer !== null && !isHovered) || (hoveredAspectIndex !== null);
          const opacity = isConstellationMode
            ? 0.1 // Much dimmer in constellation mode
            : isFocused 
              ? isPlanetFocus
                ? (isActive ? 0.15 : 0.05) // Much dimmer in planet focus mode
                : (isActive ? 1 : 0.2)     // Normal layer focus
              : isDimmed 
                ? 0.15  // Much dimmer when hovering other elements
                : isHovered 
                  ? 1 
                  : 0.8;
          
          // Scale line width with layer: larger layers (higher index) = thicker lines
          // House 1 (layer 0) starts at 2.5, House 12 (layer 11) ends at 6
          const baseWidth = 2.5 + (layer / (TOTAL_LAYERS - 1)) * 3.5;
          const lineWidth = isActive ? baseWidth + 2 : isHovered ? baseWidth + 1 : baseWidth;

          return (
            <group key={`spiral-${layer}`}>
              <>
                <Line
                  points={points}
                  color={color}
                  lineWidth={lineWidth}
                  transparent
                  opacity={opacity}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    if (!focusedHouse) {
                      setHoveredLayer(layer);
                      document.body.style.cursor = 'pointer';
                    }
                  }}
                  onPointerOut={(e) => {
                    e.stopPropagation();
                    setHoveredLayer(null);
                    document.body.style.cursor = 'default';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!focusedHouse) {
                      onLayerClick(layer);
                    }
                  }}
                />
                
                {/* Tooltip for hovered layer */}
                {isHovered && !focusedHouse && (
                  <Html position={[0, (layer / TOTAL_LAYERS) * HEIGHT - HEIGHT / 2, 0]} center>
                    <div
                      className="px-4 py-2 rounded-full backdrop-blur-xl border pointer-events-none whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7))',
                        borderColor: color,
                        boxShadow: `0 8px 32px ${color}60`,
                      }}
                    >
                      <div className="text-white text-sm">
                        House {layer + 1} • {getHouseName(layer)}
                      </div>
                    </div>
                  </Html>
                )}
              </>
              {/* Glow effect for active or hovered layer */}
              {(isActive || isHovered) && (
                <Line
                  points={points}
                  color={color}
                  lineWidth={lineWidth + 3}
                  transparent
                  opacity={isActive ? 0.4 : 0.3}
                />
              )}
            </group>
          );
        })}

        {/* Planet nodes */}
        {spiralData.layerMetadata.map((layerData) => {
          const shouldShow = !focusedHouse || focusedHouse.layerIndex === layerData.layer;
          if (!shouldShow) return null;

          const isPlanetFocus = focusedHouse?.planetIndex !== undefined;
          const isActiveLayer = focusedHouse?.layerIndex === layerData.layer;
          
          // Determine view mode
          let viewMode: 'overview' | 'layer' | 'planet' = 'overview';
          if (isPlanetFocus && isActiveLayer) {
            viewMode = 'planet';
          } else if (focusedHouse && isActiveLayer) {
            viewMode = 'layer';
          }

          return (
            <group key={`planets-${layerData.layer}`}>
              {layerData.planets.map((planet, planetIndex) => (
                <PlanetNode
                  key={`planet-${layerData.layer}-${planetIndex}`}
                  basePosition={planet.basePosition}
                  orbitRadius={planet.orbitRadius}
                  orbitSpeed={planet.orbitSpeed}
                  color={HOUSE_COLORS[layerData.layer]}
                  isActive={
                    focusedHouse?.layerIndex === layerData.layer &&
                    focusedHouse?.planetIndex === planet.globalIndex
                  }
                  onClick={() => {
                    // Pass the GLOBAL planet index, not the local array index
                    console.log('🖱️ Planet clicked:', {
                      layerIndex: layerData.layer,
                      globalIndex: planet.globalIndex,
                      planetName: planet.planetName,
                      position: planet.basePosition,
                      PLANET_NAMES_lookup: PLANET_NAMES[planet.globalIndex]
                    });
                    onPlanetClick(layerData.layer, planet.globalIndex, planet.basePosition);
                  }}
                  planetName={planet.planetName || `Planet ${planet.globalIndex + 1}`}
                  viewMode={viewMode}
                  isFocusedLayer={isActiveLayer}
                  isNearCusp={planet.isNearCusp}
                  degreesToNextCusp={planet.degreesToNextCusp}
                />
              ))}
            </group>
          );
        })}

        {/* Aspect lines connecting planets */}
        {!focusedHouse && <AspectLines chart={chart} spiralData={spiralData} isFlatView={isFlatView} hoveredAspectIndex={hoveredAspectIndex} setHoveredAspectIndex={setHoveredAspectIndex} onAspectClick={onAspectClick} focusedAspect={focusedAspect} isConstellationMode={isConstellationMode} />}

        {/* 3D Zodiac sign models at the center of each house layer */}
        {spiralData.layerMetadata.map((layerData) => {
          // Position at the center of each layer
          const centerPosition: [number, number, number] = [0, layerData.centerY, 0];
          const fusionLabelPosition: [number, number, number] = [0, layerData.centerY - 0.8, 0]; // Below the model
          const isPlanetFocus = focusedHouse?.planetIndex !== undefined;
          const isActiveLayer = focusedHouse?.layerIndex === layerData.layer;
          const isHouseLayerView = focusedHouse !== null && !isPlanetFocus;
          const isHovered = hoveredLayer === layerData.layer;
          
          // Only show ZodiacModel3D when:
          // 1. In house layer view AND this is the active layer, OR
          // 2. In overview mode (no focusedHouse) AND this layer is hovered
          const shouldShowZodiacModel = (isHouseLayerView && isActiveLayer) || (!focusedHouse && isHovered);
          
          // Fusion label: only show in House Layer View, bright for focused layer, dimmed for others
          const fusionLabelOpacity = !isHouseLayerView 
            ? 0  // Hidden in overview and planet view
            : isActiveLayer 
              ? 1  // Bright when focused
              : 0.2; // Dimmed for other layers
          
          return (
            <group key={`zodiac-model-${layerData.layer}`}>
              {shouldShowZodiacModel && (
                <ZodiacModel3D
                  zodiacIndex={layerData.layer}
                  position={centerPosition}
                  scale={1.5}
                  color={HOUSE_COLORS[layerData.layer]}
                  rotationSpeed={0.2}
                  onClick={(e) => {
                    e?.stopPropagation?.();
                    console.log('🎯 Zodiac sign clicked, entering house layer view:', layerData.layer);
                    onLayerClick(layerData.layer);
                  }}
                />
              )}
              {/* Fusion Label beneath the 3D zodiac figure - ONLY in House Layer View */}
              <FusionLabel
                houseIndex={layerData.layer}
                position={fusionLabelPosition}
                color={HOUSE_COLORS[layerData.layer]}
                opacity={fusionLabelOpacity}
                enrichedChart={chart}
              />
            </group>
          );
        })}

        {/* House Star Cues - poetic sentences within each layer */}
        {spiralData.layerMetadata.map((layerData) => {
          const isPlanetFocus = focusedHouse?.planetIndex !== undefined;
          const isActiveLayer = focusedHouse?.layerIndex === layerData.layer;
          const isFocused = focusedHouse?.layerIndex === layerData.layer && !isPlanetFocus;
          
          // Determine view mode
          let viewMode: 'overview' | 'layer' | 'planet' = 'overview';
          if (isPlanetFocus && isActiveLayer) {
            viewMode = 'planet';
          } else if (focusedHouse && isActiveLayer) {
            viewMode = 'layer';
          } else if (!focusedHouse) {
            viewMode = 'overview';
          }
          
          // Show star cues (not in constellation mode)
          const isVisible = !isConstellationMode;
          
          // Calculate the layer radius at this position
          const layerT = (layerData.layer + 0.5) / TOTAL_LAYERS;
          const layerRadius = START_RADIUS + layerT * (END_RADIUS - START_RADIUS);
          
          return (
            <HouseStarCues
              key={`star-cue-${layerData.layer}`}
              layerIndex={layerData.layer}
              centerY={layerData.centerY}
              layerRadius={layerRadius}
              isVisible={isVisible}
              viewMode={viewMode}
              isFocusedLayer={isActiveLayer}
              isAnyLayerFocused={focusedHouse !== null}
            />
          );
        })}

        {/* Ambient particles in overview mode */}
        {!focusedHouse && <AmbientParticles />}
      </group>
    </>
  );
}

function AmbientParticles() {
  const groupRef = useRef<any>();
  const particleData = useMemo(() => {
    return Array.from({ length: 80 }, () => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
      ] as [number, number, number],
      speed: 0.15 + Math.random() * 0.4,
      size: 0.03 + Math.random() * 0.05,
      offset: Math.random() * Math.PI * 2, // Random phase offset
    }));
  }, []);

  // Single useFrame for all particles
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((mesh: any, index: number) => {
        const data = particleData[index];
        mesh.position.y = data.position[1] + Math.sin(time * data.speed + data.offset) * 2.5;
        mesh.position.x = data.position[0] + Math.cos(time * data.speed * 0.5 + data.offset) * 0.5;
        mesh.rotation.y = time * 0.003;
        
        const pulse = Math.sin(time * data.speed * 2 + data.offset) * 0.5 + 0.5;
        mesh.scale.setScalar(1 + pulse * 0.3);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particleData.map((data, i) => (
        <mesh key={i} position={data.position}>
          <sphereGeometry args={[data.size, 8, 8]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function AspectLines({ chart, spiralData, isFlatView, hoveredAspectIndex, setHoveredAspectIndex, onAspectClick, focusedAspect, isConstellationMode }: { chart: EnrichedChart | null; spiralData: any; isFlatView: boolean; hoveredAspectIndex: number | null; setHoveredAspectIndex: (index: number | null) => void; onAspectClick?: (aspectData: any) => void; focusedAspect?: any; isConstellationMode?: boolean }) {
  const [aspectsOpacity, setAspectsOpacity] = useState(0);
  const lineRefs = useRef<any[]>([]);
  const glowRefs = useRef<any[]>([]);

  // Calculate angular position of a planet (in degrees)
  const getAngle = (position: [number, number, number]): number => {
    const [x, y, z] = position;
    const angle = Math.atan2(z, x) * (180 / Math.PI);
    return angle < 0 ? angle + 360 : angle;
  };

  // Calculate aspect between two planets
  const calculateAspect = (angle1: number, angle2: number): { type: string; color: string; description: string } | null => {
    let diff = Math.abs(angle1 - angle2);
    
    // Normalize to 0-180 range
    if (diff > 180) diff = 360 - diff;

    // Check each aspect type
    for (const [aspectType, aspectData] of Object.entries(ASPECTS)) {
      if (Math.abs(diff - aspectData.angle) <= aspectData.orb) {
        return {
          type: aspectType,
          color: aspectData.color,
          description: aspectData.description,
        };
      }
    }

    return null; // No aspect found
  };

  // Generate aspect lines between planets based on astrological aspects
  const aspectLines = useMemo(() => {
    // Use REAL aspects from chart if available
    if (chart && chart.aspects && chart.aspects.length > 0) {
      console.log(`🌟 Using ${chart.aspects.length} REAL aspects from API chart data`);
      
      const lines: Array<{ 
        start: [number, number, number]; 
        end: [number, number, number]; 
        color: string;
        aspectType: string;
        description: string;
        planetNames?: string;
        planet1: string;
        planet2: string;
      }> = [];
      
      // Map aspect lines from chart data
      console.log('🔷 Mapping aspect lines from chart data...');
      
      chart.aspects.forEach((aspect: any, index: number) => {
        // Debug: Log first aspect structure
        if (index === 0) {
          console.log('🔍 First aspect full structure:', JSON.stringify(aspect, null, 2));
          console.log('🔍 aspect.api:', aspect.api);
          console.log('🔍 aspect.api?.type:', aspect.api?.type);
        }
        
        // Skip aspects with empty or missing type
        const aspectTypeRaw = aspect.api?.type || '';
        if (!aspectTypeRaw || aspectTypeRaw.trim() === '') {
          console.log(`  ⚠️ Skipping aspect with empty type: ${aspect.from.planet.name} ↔ ${aspect.to.planet.name}`);
          return;
        }
        
        console.log(`  🔍 Processing aspect: "${aspectTypeRaw}" between ${aspect.from.planet.name} and ${aspect.to.planet.name}`);
        
        // Find positions for the two planets
        let planet1Position: [number, number, number] | null = null;
        let planet2Position: [number, number, number] | null = null;
        
        // Search through all layers to find the planet positions
        spiralData.layerMetadata.forEach((layerData: any) => {
          layerData.planets.forEach((planet: any) => {
            if (planet.planetName === aspect.from.planet.name) {
              planet1Position = planet.basePosition;
            }
            if (planet.planetName === aspect.to.planet.name) {
              planet2Position = planet.basePosition;
            }
          });
        });
        
        // Only add if both planets found
        if (planet1Position && planet2Position) {
          // Map aspect type to color - handle various formats from API
          const aspectColors: Record<string, { color: string; description: string }> = {
            'conjunction': { color: '#FFD700', description: 'Union, fusion, concentrated power' },
            'sextile': { color: '#00C4CC', description: 'Harmony, opportunity, ease' },
            'square': { color: '#D72638', description: 'Tension, challenge, activation' },
            'trine': { color: '#4CAF50', description: 'Flow, talent, balance' },
            'opposition': { color: '#3F51B5', description: 'Polarity, confrontation, reflection' },
            'quintile': { color: '#9C27B0', description: 'Creative talent, unique gifts' },
            'biquintile': { color: '#AB47BC', description: 'Refined creativity, mastery' },
            'semisextile': { color: '#26A69A', description: 'Subtle connection, adjustment' },
            'quincunx': { color: '#FF9800', description: 'Adjustment, redirect, pivot' },
            'semisquare': { color: '#F4511E', description: 'Mild friction, irritation' },
            'sesquiquadrate': { color: '#E65100', description: 'Persistent friction, test' },
          };
          
          // Get the aspect type from the API and normalize it
          const normalizedType = aspectTypeRaw.toLowerCase().trim();
          console.log(`  🔍 Normalized type: "${normalizedType}"`);
          
          const aspectInfo = aspectColors[normalizedType] || { 
            color: '#FFFFFF', 
            description: aspectTypeRaw || 'Unknown aspect'
          };
          
          if (!aspectColors[normalizedType]) {
            console.warn(`  ⚠️ Unknown aspect type: "${aspectTypeRaw}" (normalized: "${normalizedType}")`);
          }
          
          lines.push({
            start: planet1Position,
            end: planet2Position,
            color: aspectInfo.color,
            aspectType: aspectTypeRaw || 'Unknown',
            description: aspectInfo.description,
            planetNames: `${aspect.from.planet.name} - ${aspect.to.planet.name}`,
            planet1: aspect.from.planet.name,
            planet2: aspect.to.planet.name,
          });
          
          console.log(`  ⚡ ${aspectTypeRaw}: ${aspect.from.planet.name} ↔ ${aspect.to.planet.name} (color: ${aspectInfo.color}, orb: ${aspect.api?.orb?.toFixed(1) || '?'}°)`);
        } else {
          console.warn(`  ⚠️ Could not find positions for aspect: ${aspect.from.planet.name} ↔ ${aspect.to.planet.name}`);
        }
      });
      
      console.log(`✅ Generated ${lines.length} aspect lines from chart data`);
      return lines;
    }
    
    // FALLBACK: Calculate aspects from positions (old logic)
    console.log('️ No chart aspects available, calculating from positions (fallback)');
    
    // Collect all planets from all layers
    const allPlanets: Array<{ 
      position: [number, number, number]; 
      layer: number; 
      angle: number;
      planetIndex: number;
    }> = [];
    
    let globalIndex = 0;
    spiralData.layerMetadata.forEach((layerData: any) => {
      layerData.planets.forEach((planet: any) => {
        allPlanets.push({
          position: planet.basePosition,
          layer: layerData.layer,
          angle: getAngle(planet.basePosition),
          planetIndex: globalIndex++,
        });
      });
    });

    const lines: Array<{ 
      start: [number, number, number]; 
      end: [number, number, number]; 
      color: string;
      aspectType: string;
      description: string;
    }> = [];

    // Check all planet pairs for aspects
    for (let i = 0; i < allPlanets.length; i++) {
      for (let j = i + 1; j < allPlanets.length; j++) {
        const planet1 = allPlanets[i];
        const planet2 = allPlanets[j];
        
        const aspect = calculateAspect(planet1.angle, planet2.angle);
        
        if (aspect) {
          lines.push({
            start: planet1.position,
            end: planet2.position,
            color: aspect.color,
            aspectType: aspect.type,
            description: aspect.description,
          });
        }
      }
    }

    console.log(`🌟 Found ${lines.length} astrological aspects:`, 
      lines.reduce((acc, line) => {
        acc[line.aspectType] = (acc[line.aspectType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    );

    return lines;
  }, [chart, spiralData.layerMetadata]);

  // Adjust visibility based on view mode and constellation mode
  const baseOpacity = isConstellationMode 
    ? 0.8  // Brighter in constellation mode
    : isFlatView ? 0.5 : 0.6;
  const lineWidth = isConstellationMode 
    ? 3.5  // Thicker in constellation mode
    : isFlatView ? 1.8 : 2.2;
  const glowOpacity = isConstellationMode 
    ? 0.7  // Stronger glow in constellation mode
    : isFlatView ? 0.3 : 0.4;

  // Fade in aspect lines and handle hover animations
  useFrame(() => {
    setAspectsOpacity(prev => Math.min(1, prev + 0.02));
    
    // Smooth hover animation for each line - very slow and gradual
    lineRefs.current.forEach((lineRef, i) => {
      if (lineRef && glowRefs.current[i]) {
        const isHovered = hoveredAspectIndex === i;
        const targetOpacity = isHovered ? 1 : baseOpacity;
        const targetGlowOpacity = isHovered ? glowOpacity * 2 : glowOpacity;
        
        // Ultra-smooth lerp animation (0.03 = very slow, elegant fade)
        if (lineRef.material) {
          lineRef.material.opacity += (aspectsOpacity * targetOpacity - lineRef.material.opacity) * 0.03;
          // Ensure color is set (sometimes Line needs manual color refresh)
          if (aspectLines[i]?.color) {
            lineRef.material.color.set(aspectLines[i].color);
          }
        }
        if (glowRefs.current[i]?.material) {
          glowRefs.current[i].material.opacity += (aspectsOpacity * targetGlowOpacity - glowRefs.current[i].material.opacity) * 0.03;
          // Ensure color is set on glow line too
          if (aspectLines[i]?.color) {
            glowRefs.current[i].material.color.set(aspectLines[i].color);
          }
        }
      }
    });
  });

  return (
    <>
      {aspectLines.map((line, i) => {
        const isHovered = hoveredAspectIndex === i;
        
        // Check if this line is the focused aspect (clicked in constellation mode)
        const isFocusedAspect = focusedAspect && 
          line.aspectType === focusedAspect.type &&
          ((line.start[0] === focusedAspect.start?.[0] && line.start[1] === focusedAspect.start?.[1] && line.start[2] === focusedAspect.start?.[2]) ||
           (line.end[0] === focusedAspect.start?.[0] && line.end[1] === focusedAspect.start?.[1] && line.end[2] === focusedAspect.start?.[2]));
        
        const displayOpacity = isFocusedAspect ? 1 : (isHovered ? 1 : baseOpacity);
        const displayWidth = isFocusedAspect ? lineWidth + 1.5 : (isHovered ? lineWidth + 0.8 : lineWidth);
        const displayGlowOpacity = isFocusedAspect ? glowOpacity * 3 : (isHovered ? glowOpacity * 2 : glowOpacity);
        
        // Calculate midpoint for tooltip position
        const midpoint: [number, number, number] = [
          (line.start[0] + line.end[0]) / 2,
          (line.start[1] + line.end[1]) / 2,
          (line.start[2] + line.end[2]) / 2,
        ];

        return (
          <group key={`aspect-${i}`}>
            {/* Star-like nodes at endpoints in constellation mode */}
            {isConstellationMode && (
              <>
                <mesh position={line.start}>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshBasicMaterial color={line.color} transparent opacity={0.9} />
                </mesh>
                <mesh position={line.start}>
                  <sphereGeometry args={[0.25, 16, 16]} />
                  <meshBasicMaterial color={line.color} transparent opacity={0.3} />
                </mesh>
                
                <mesh position={line.end}>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshBasicMaterial color={line.color} transparent opacity={0.9} />
                </mesh>
                <mesh position={line.end}>
                  <sphereGeometry args={[0.25, 16, 16]} />
                  <meshBasicMaterial color={line.color} transparent opacity={0.3} />
                </mesh>
              </>
            )}

            {/* Invisible thick hitbox for easier hovering */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredAspectIndex(i);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredAspectIndex(null);
                document.body.style.cursor = 'default';
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onAspectClick) {
                  onAspectClick({
                    type: line.aspectType,
                    color: line.color,
                    description: line.description,
                    start: line.start,
                    end: line.end,
                    planet1: line.planet1,
                    planet2: line.planet2,
                  });
                }
              }}
            >
              <Line
                points={[line.start, line.end]}
                lineWidth={8} // Much thicker invisible hitbox
                transparent
                opacity={0} // Invisible
              />
            </mesh>

            {/* Main aspect line */}
            <Line
              points={[line.start, line.end]}
              color={line.color}
              lineWidth={displayWidth}
              transparent
              opacity={aspectsOpacity * displayOpacity}
              dashed={!isConstellationMode}  // Solid in constellation mode
              dashScale={5}
              dashSize={0.5}
              gapSize={0.5}
              ref={(ref) => lineRefs.current[i] = ref}
            />
            {/* Glow effect for better visibility */}
            <Line
              points={[line.start, line.end]}
              color={line.color}
              lineWidth={displayWidth + (isConstellationMode ? 2.5 : 1.5)}
              transparent
              opacity={aspectsOpacity * displayGlowOpacity}
              ref={(ref) => glowRefs.current[i] = ref}
            />
            
            {/* Tooltip on hover */}
            {isHovered && !isConstellationMode && (
              <Html position={midpoint} center zIndexRange={[0, 50]} sprite>
                <div
                  className="px-4 py-3 rounded-lg backdrop-blur-xl border-2 pointer-events-none whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8))',
                    borderColor: line.color,
                    boxShadow: `0 8px 32px ${line.color}80, 0 0 20px ${line.color}40`,
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <div 
                      className="text-sm tracking-wide"
                      style={{ color: line.color }}
                    >
                      ✦ {line.aspectType}
                    </div>
                    <div className="text-xs text-white/80">
                      {line.description}
                    </div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}