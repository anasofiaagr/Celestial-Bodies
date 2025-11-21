import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useChart } from '../contexts/ChartContext';
import type { EnrichedChart } from '../utils/ChartEnricher';
import { generateSentence, type TokenData } from '../utils/SentenceEngine';

interface Aspect {
  planetA: string;
  planetB: string;
  type: 'Conjunction' | 'Opposition' | 'Square' | 'Trine' | 'Sextile';
  strength: number;
  orb: number;
  color: string;
}

interface ConstellationArtifactRendererProps {
  onRenderComplete?: (canvas: HTMLCanvasElement) => void;
}

// Constants from Spiral.tsx
const TOTAL_LAYERS = 12;
const POINTS_PER_LAYER = 100;
const TOTAL_POINTS = TOTAL_LAYERS * POINTS_PER_LAYER;
const HEIGHT = 26;
const START_RADIUS = 2.5;
const END_RADIUS = 5.5;

const HOUSE_COLORS = [
  '#F94144', '#F3722C', '#F8961E', '#F9C74F',
  '#90BE6D', '#43AA8B', '#577590', '#277DA1',
  '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'
];

// Planet colors
const PLANET_COLORS: Record<string, string> = {
  Sun: '#F9C74F',
  Moon: '#90DBF4',
  Mercury: '#F8961E',
  Venus: '#F3722C',
  Mars: '#F94144',
  Jupiter: '#9B5DE5',
  Saturn: '#577590',
  Uranus: '#43AA8B',
  Neptune: '#4D908E',
  Pluto: '#277DA1',
};

// Aspect colors
const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#FFD700',
  Sextile: '#00C4CC',
  Square: '#D72638',
  Trine: '#4CAF50',
  Opposition: '#3F51B5',
};

// Generate spiral structure - EXACT from Spiral.tsx
function generateSpiralData() {
  const segments = [];

  for (let layer = 0; layer < TOTAL_LAYERS; layer++) {
    const layerPoints: [number, number, number][] = [];

    for (let i = 0; i < POINTS_PER_LAYER; i++) {
      const t = (layer * POINTS_PER_LAYER + i) / TOTAL_POINTS;
      const angle = t * Math.PI * 2 * TOTAL_LAYERS;
      const radius = START_RADIUS + t * (END_RADIUS - START_RADIUS);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = HEIGHT / 2 - t * HEIGHT;
      layerPoints.push([x, y, z]);
    }

    segments.push({ 
      points: layerPoints, 
      color: HOUSE_COLORS[layer], 
      layer 
    });
  }

  return segments;
}

// Calculate planet positions on spiral - EXACT logic from Spiral.tsx
function calculatePlanetPositions(chart: EnrichedChart | null) {
  if (!chart || !chart.planets || chart.planets.length === 0) {
    return [];
  }

  const planets: Array<{
    name: string;
    position: [number, number, number];
    color: string;
  }> = [];

  const findHouseForDegree = (degree: number): number => {
    const normalizedDegree = ((degree % 360) + 360) % 360;
    
    for (let i = 0; i < 12; i++) {
      const currentHouse = chart.houses[i];
      const nextHouse = chart.houses[(i + 1) % 12];
      
      const currentCusp = currentHouse.cusp_degree;
      const nextCusp = nextHouse.cusp_degree;
      
      if (currentCusp < nextCusp) {
        if (normalizedDegree >= currentCusp && normalizedDegree < nextCusp) {
          return currentHouse.id;
        }
      } else {
        if (normalizedDegree >= currentCusp || normalizedDegree < nextCusp) {
          return currentHouse.id;
        }
      }
    }
    
    return 1;
  };

  chart.planets.forEach((enrichedPlanet) => {
    const absoluteDegree = enrichedPlanet.api.degree;
    const actualHouseId = findHouseForDegree(absoluteDegree);
    const houseId = actualHouseId;
    const layerIndex = houseId - 1;
    
    const houseCuspDegree = chart.houses.find(h => h.id === houseId)?.cusp_degree || 0;
    
    let degreeFromCusp = absoluteDegree - houseCuspDegree;
    if (degreeFromCusp < 0) {
      degreeFromCusp += 360;
    }
    if (degreeFromCusp > 180) {
      degreeFromCusp -= 360;
    }
    
    const nextHouseId = (houseId % 12) + 1;
    const nextHouseCusp = chart.houses.find(h => h.id === nextHouseId)?.cusp_degree || (houseCuspDegree + 30);
    
    let houseSize = nextHouseCusp - houseCuspDegree;
    if (houseSize <= 0) {
      houseSize += 360;
    }
    
    const progressThroughHouse = degreeFromCusp / houseSize;
    const t = (layerIndex + progressThroughHouse) / TOTAL_LAYERS;
    const angle = t * Math.PI * 2 * TOTAL_LAYERS;
    const radius = START_RADIUS + t * (END_RADIUS - START_RADIUS);
    
    const px = Math.cos(angle) * radius;
    const pz = Math.sin(angle) * radius;
    const py = HEIGHT / 2 - t * HEIGHT;
    
    planets.push({
      name: enrichedPlanet.planet.name,
      position: [px, py, pz],
      color: PLANET_COLORS[enrichedPlanet.planet.name] || '#ffffff'
    });
  });

  return planets;
}

// Calculate aspects - EXACT from AspectLines component
function calculateAspects(chart: EnrichedChart | null, planetPositions: Array<{ name: string; position: [number, number, number] }>) {
  if (!chart || !chart.aspects) {
    console.log('❌ No chart or aspects data');
    return [];
  }

  console.log('🔍 Chart aspects:', chart.aspects.length, 'aspects found');
  console.log('🔍 Planet positions available:', planetPositions.map(p => p.name));

  const aspects: Array<{
    planetA: string;
    planetB: string;
    posA: [number, number, number];
    posB: [number, number, number];
    color: string;
    type: string;
    strength: number;
  }> = [];

  chart.aspects.forEach((aspect, index) => {
    // EnrichedAspect has `from` and `to` properties with EnrichedPlanet objects
    const planet1Name = aspect.from.planet.name;
    const planet2Name = aspect.to.planet.name;
    const aspectType = aspect.api.type;
    const aspectOrb = aspect.api.orb;
    
    console.log(`🔍 Processing aspect ${index}:`, planet1Name, '->', planet2Name, '(', aspectType, ')');
    
    const planetA = planetPositions.find(p => p.name.toLowerCase() === planet1Name.toLowerCase());
    const planetB = planetPositions.find(p => p.name.toLowerCase() === planet2Name.toLowerCase());
    
    console.log(`   Found planetA (${planet1Name}):`, !!planetA, planetA?.position);
    console.log(`   Found planetB (${planet2Name}):`, !!planetB, planetB?.position);
    
    if (planetA && planetB) {
      const color = ASPECT_COLORS[aspectType as keyof typeof ASPECT_COLORS] || '#ffffff';
      
      // Calculate strength based on orb (tighter orb = stronger)
      const maxOrb = 10;
      const strength = Math.max(0.4, 1 - (aspectOrb / maxOrb));
      
      console.log(`   ✅ Adding aspect: ${color}, strength: ${strength}`);
      
      aspects.push({
        planetA: planetA.name,
        planetB: planetB.name,
        posA: planetA.position,
        posB: planetB.position,
        color,
        type: aspectType,
        strength
      });
    } else {
      console.log(`   ❌ Skipping aspect - missing planet positions`);
    }
  });

  console.log('✅ Total aspects calculated:', aspects.length);
  return aspects;
}

// 3D Constellation Scene
function Constellation3DScene({ chart }: { chart: EnrichedChart | null }) {
  const spiralSegments = generateSpiralData();
  const planetPositions = calculatePlanetPositions(chart);
  const aspects = calculateAspects(chart, planetPositions);

  // Constellation mode settings - MORE PROMINENT ASPECTS
  const baseOpacity = 1;
  const lineWidth = 4.5; // Thicker lines
  const glowOpacity = 0.9; // Stronger glow
  const aspectsOpacity = 1;
  const spiralOpacity = 0.15;

  console.log('🌟 Rendering constellation artifact:');
  console.log('   Planets:', planetPositions.length);
  console.log('   Aspects:', aspects.length);
  console.log('   Aspects data:', aspects);

  return (
    <group>
      {/* Spiral Rings - House layers */}
      {spiralSegments.map(({ points, color, layer }) => {
        const baseWidth = 2.5 + (layer / (TOTAL_LAYERS - 1)) * 3.5;
        
        return (
          <group key={`spiral-${layer}`}>
            <Line
              points={points}
              color={color}
              lineWidth={baseWidth}
              transparent
              opacity={spiralOpacity}
            />
            
            <Line
              points={points}
              color={color}
              lineWidth={baseWidth + 1.5}
              transparent
              opacity={spiralOpacity * 0.4}
            />
          </group>
        );
      })}

      {/* Aspect Lines - RENDER FIRST for proper depth */}
      {aspects.map((aspect, index) => (
        <group key={`aspect-${index}`}>
          {/* Main aspect line - THICKER AND BRIGHTER */}
          <Line
            points={[aspect.posA, aspect.posB]}
            color={aspect.color}
            lineWidth={lineWidth}
            transparent
            opacity={aspectsOpacity * baseOpacity * aspect.strength}
          />
          
          {/* Strong glow effect - MULTIPLE LAYERS */}
          <Line
            points={[aspect.posA, aspect.posB]}
            color={aspect.color}
            lineWidth={lineWidth + 3}
            transparent
            opacity={aspectsOpacity * glowOpacity * aspect.strength * 0.6}
          />
          
          <Line
            points={[aspect.posA, aspect.posB]}
            color={aspect.color}
            lineWidth={lineWidth + 6}
            transparent
            opacity={aspectsOpacity * glowOpacity * aspect.strength * 0.3}
          />

          {/* Star nodes at endpoints - LARGER */}
          <mesh position={aspect.posA}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={aspect.color} transparent opacity={1} />
          </mesh>
          <mesh position={aspect.posA}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshBasicMaterial color={aspect.color} transparent opacity={0.4} />
          </mesh>
          
          <mesh position={aspect.posB}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={aspect.color} transparent opacity={1} />
          </mesh>
          <mesh position={aspect.posB}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshBasicMaterial color={aspect.color} transparent opacity={0.4} />
          </mesh>
        </group>
      ))}

      {/* Planet Nodes */}
      {planetPositions.map((planet) => (
        <group key={planet.name} position={planet.position}>
          <mesh>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial 
              color={planet.color}
              transparent
              opacity={0.35}
            />
          </mesh>

          <mesh>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial 
              color={planet.color}
              emissive={planet.color}
              emissiveIntensity={0.7}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function ConstellationArtifactRenderer({
  onRenderComplete
}: ConstellationArtifactRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const { chart, subject } = useChart();

  useEffect(() => {
    if (!chart) return;

    const timer = setTimeout(async () => {
      const threeCanvas = containerRef.current?.querySelector('canvas');
      if (!threeCanvas || !overlayCanvasRef.current) return;

      const overlayCanvas = overlayCanvasRef.current;
      const ctx = overlayCanvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const width = 2048;
      const height = 2048;
      
      overlayCanvas.width = width;
      overlayCanvas.height = height;

      // ===== GENERATE SPIRAL SENTENCE =====
      let spiralSentenceTokens: TokenData[] = [];
      try {
        const chartSummary = {
          dominant_element: chart.chartSummary?.dominant_element || 'Fire',
          dominant_element_phrase: chart.chartSummary?.dominant_element_phrase || 'quick sparks, heat, impulse',
          dominant_mode: chart.chartSummary?.dominant_mode || 'Cardinal',
          dominant_mode_phrase: chart.chartSummary?.dominant_mode_phrase || 'initiating new patterns',
          primary_cluster_house: {
            name: chart.chartSummary?.primary_cluster_house?.name || 'House of Emergence',
            essence: chart.chartSummary?.primary_cluster_house?.essence || 'self, emergence',
            keywords: chart.chartSummary?.primary_cluster_house?.keywords || []
          },
          signature_planet: {
            name: chart.chartSummary?.signature_planet?.name || 'Sun',
            archetype_figure_name: chart.chartSummary?.signature_planet?.archetype_figure_name || 'The Hero',
            archetype_name: chart.chartSummary?.signature_planet?.archetype_name || 'Core Self',
            essence: chart.chartSummary?.signature_planet?.essence || 'vitality'
          },
          signature_sign: {
            name: chart.chartSummary?.signature_sign?.name || 'Aries',
            archetype_name: chart.chartSummary?.signature_sign?.archetype_name || 'Fire of Beginning',
            expressions: chart.chartSummary?.signature_sign?.expressions || []
          },
          aspect_mood: chart.chartSummary?.aspect_mood || 'dynamic',
          aspect_keywords: chart.chartSummary?.aspect_keywords || ['tension', 'flow']
        };

        const payload = {
          chart: chartSummary,
          enrichedChart: chart
        };

        const result = generateSentence('spiral_overview', payload, 'primary');
        if (result && result.tokens) {
          spiralSentenceTokens = result.tokens;
          console.log('✅ Generated spiral sentence tokens for artifact:', spiralSentenceTokens.length, 'tokens');
        } else {
          console.warn('⚠️ No sentence generated, using fallback');
          spiralSentenceTokens = [
            { text: 'A unique constellation of cosmic energies, woven together in this moment of emergence.', color: 'rgba(255, 255, 255, 0.95)', isVariable: false }
          ];
        }
      } catch (error) {
        console.error('❌ Error generating spiral sentence:', error);
        spiralSentenceTokens = [
          { text: 'A unique constellation of cosmic energies, woven together in this moment of emergence.', color: 'rgba(255, 255, 255, 0.95)', isVariable: false }
        ];
      }

      console.log('📝 Final spiral sentence tokens:', spiralSentenceTokens);

      // ===== BACKGROUND =====
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#0f0a1f');
      bgGradient.addColorStop(0.5, '#1a0b2e');
      bgGradient.addColorStop(1, '#000000');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const glowGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.5);
      glowGradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
      glowGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);

      // ===== STAR FIELD =====
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1.2 + 0.3;
        const alpha = Math.random() * 0.4 + 0.1;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (let i = 0; i < 120; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2.5 + 0.8;
        const brightness = Math.random();
        
        const starGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        starGlow.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.5})`);
        starGlow.addColorStop(0.5, `rgba(167, 139, 250, ${brightness * 0.2})`);
        starGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = starGlow;
        ctx.fillRect(x - size * 4, y - size * 4, size * 8, size * 8);
        
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = brightness;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ===== DRAW 3D SCENE =====
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(threeCanvas, 0, 0, width, height);
      ctx.drawImage(tempCanvas, 0, 0);

      // ===== DECORATIVE FRAME =====
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
      ctx.lineWidth = 6;
      const bracketSize = 120;
      const margin = 60;

      ctx.beginPath();
      ctx.moveTo(margin + bracketSize, margin);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin, margin + bracketSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - margin - bracketSize, margin);
      ctx.lineTo(width - margin, margin);
      ctx.lineTo(width - margin, margin + bracketSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(margin, height - margin - bracketSize);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(margin + bracketSize, height - margin);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - margin - bracketSize, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.lineTo(width - margin, height - margin - bracketSize);
      ctx.stroke();

      // ===== TEXT OVERLAYS =====
      ctx.fillStyle = 'rgba(167, 139, 250, 0.85)';
      ctx.font = 'bold 52px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('CELESTIAL BODIES', margin + 20, margin + 20);

      ctx.fillStyle = 'rgba(139, 92, 246, 0.65)';
      ctx.font = '30px sans-serif';
      ctx.fillText('Constellation Map', margin + 20, margin + 85);

      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(167, 139, 250, ${0.7 - i * 0.12})`;
        ctx.beginPath();
        ctx.arc(width - margin - 50 - i * 28, margin + 55, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (subject) {
        const chartDate = `${subject.month}/${subject.day}/${subject.year} at ${String(subject.hour).padStart(2, '0')}:${String(subject.minute).padStart(2, '0')}`;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.font = 'bold 76px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(subject.name, margin + 20, height - margin - 130);

        ctx.fillStyle = 'rgba(167, 139, 250, 0.9)';
        ctx.font = '38px sans-serif';
        ctx.fillText(chartDate, margin + 20, height - margin - 75);

        ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
        ctx.font = '34px sans-serif';
        ctx.fillText(`${subject.city}, ${subject.nation}`, margin + 20, height - margin - 30);
      }

      const aspectCount = chart.aspects?.length || 0;
      const planetCount = chart.planets?.length || 0;
      
      ctx.fillStyle = 'rgba(167, 139, 250, 0.85)';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${aspectCount} Aspects • ${planetCount} Bodies`, width - margin - 20, height - margin - 30);

      // ===== SPIRAL SENTENCE - RIGHT SIDE =====
      if (spiralSentenceTokens.length > 0) {
        const sentenceMarginRight = 100;
        const sentenceWidth = 560;
        const sentenceX = width - sentenceMarginRight - sentenceWidth;
        const sentenceY = height / 2 - 400; // Moved upward
        const lineHeight = 52; // Reduced for smaller font
        const maxLineWidth = sentenceWidth;
        const fontSize = 32; // Reduced from 42 to 32

        // Set font for measurement
        ctx.font = `300 ${fontSize}px system-ui, -apple-system, sans-serif`; // font-light, matching spiral view
        ctx.textAlign = 'left'; // Changed to left for proper token positioning
        ctx.textBaseline = 'top';

        // Measure space width once
        const spaceWidth = ctx.measureText(' ').width;

        // Measure and wrap tokens into lines
        interface LineToken {
          token: TokenData;
          width: number;
        }
        const lines: LineToken[][] = [];
        let currentLine: LineToken[] = [];
        let currentLineWidth = 0;

        spiralSentenceTokens.forEach((token) => {
          const tokenWidth = ctx.measureText(token.text).width;
          const tokenWithSpace = currentLine.length > 0 ? tokenWidth + spaceWidth : tokenWidth;

          // Check if adding this token would exceed the line width
          if (currentLineWidth + tokenWithSpace > maxLineWidth && currentLine.length > 0) {
            // Start a new line
            lines.push(currentLine);
            currentLine = [{ token, width: tokenWidth }];
            currentLineWidth = tokenWidth;
          } else {
            // Add to current line
            currentLine.push({ token, width: tokenWidth });
            currentLineWidth += tokenWithSpace;
          }
        });
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }

        // Add subtle text shadow for drop-shadow-lg effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Draw each line with tokens in their individual colors
        lines.forEach((line, lineIndex) => {
          // Calculate total line width for centering
          let totalLineWidth = 0;
          line.forEach((lineToken, i) => {
            totalLineWidth += lineToken.width;
            if (i < line.length - 1) totalLineWidth += spaceWidth;
          });

          // Center the line
          let currentX = sentenceX + (sentenceWidth / 2) - (totalLineWidth / 2);
          const lineY = sentenceY + lineIndex * lineHeight;

          // Draw each token with its color
          line.forEach((lineToken, tokenIndex) => {
            // Set token color
            ctx.fillStyle = lineToken.token.color || 'rgba(255, 255, 255, 0.95)';
            ctx.fillText(lineToken.token.text, currentX, lineY);
            
            // Move to next token position
            currentX += lineToken.width;
            if (tokenIndex < line.length - 1) {
              currentX += spaceWidth; // Add space after token (except last)
            }
          });
        });

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      if (onRenderComplete) {
        onRenderComplete(overlayCanvas);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [chart, onRenderComplete, subject]);

  if (!chart) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" style={{ opacity: 0 }}>
      <div ref={containerRef} style={{ width: '2048px', height: '2048px', position: 'absolute', top: 0, left: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 30], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#a78bfa" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c084fc" />
          
          <Constellation3DScene chart={chart} />
        </Canvas>
      </div>

      <canvas ref={overlayCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}