import { Sparkles, X } from 'lucide-react';
import { SpiralIcon3D } from './icons/SpiralIcon3D';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect, useMemo } from 'react';
import { Spiral } from './Spiral';
import { UIOverlay } from './UIOverlay';
import { ZodiacBackground3D, ZodiacBackgroundOverlay } from './ZodiacBackground';
import InterpretationPanel from './InterpretationPanel';
import FloatingPoeticSentence from './FloatingPoeticSentence';
import ConstellationView from './ConstellationView';
import ConstellationModeOverlay from './ConstellationModeOverlay';
import PlanetPoeticOverlay from './PlanetPoeticOverlay';
import { HouseLayerOverlay } from './HouseLayerOverlay';
import { CueStarContainer, type ViewMode } from './CueStarContainer';
import { GlossaryOverlay } from './glossary/GlossaryOverlay';
import { GlossaryConstellationUI } from './glossary/GlossaryConstellationUI';
import RestartButton from './RestartButton';
import ShareConstellationButton from './ShareConstellationButton';
import { EvolvingView } from './EvolvingView';
import { ViewTransitionEffect, RippleEffect } from './ui/ViewTransitionEffect';
import { interpretationGenerator } from '../utils/interpretationGenerator';
import { getLayerPlanetsMap, PLANET_NAMES } from '../utils/planetDistribution';
import { useChart } from '../contexts/ChartContext';
import { motion } from 'framer-motion';

// CANONICAL planet name array - must match the order in templates
// This is the source of truth for planet indexing
const CANONICAL_PLANET_NAMES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
] as const;

// Zodiac signs matching the house order
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

interface SpiralVisualizationProps {
  onRestart?: () => void;
}

export default function SpiralVisualization({ onRestart }: SpiralVisualizationProps) {
  const { chart, loading, error } = useChart();
  
  const [focusedHouse, setFocusedHouse] = useState<{
    layerIndex: number;
    planetIndex?: number;
    position: [number, number, number];
  } | null>(null);

  const [isFlatView, setIsFlatView] = useState(false);
  const [isInterpretationPanelOpen, setIsInterpretationPanelOpen] = useState(false);
  const [isConstellationViewOpen, setIsConstellationViewOpen] = useState(false);
  const [isConstellationMode, setIsConstellationMode] = useState(false);
  const [focusedAspect, setFocusedAspect] = useState<any>(null);
  const [isEvolvingViewActive, setIsEvolvingViewActive] = useState(false);
  
  // View transition effects
  const [viewTransitionTrigger, setViewTransitionTrigger] = useState(0);
  const [rippleTrigger, setRippleTrigger] = useState(0);

  // Generate starfield particles once and cache them
  const starfieldParticles = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 2 + Math.random() * 3,
      opacity: 0.4 + Math.random() * 0.3,
      scale: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  // Helper functions
  const handlePlanetClick = (layerIndex: number, planetIndex: number, position: [number, number, number]) => {
    setFocusedHouse({ layerIndex, planetIndex, position });
  };

  const handleLayerClick = (layerIndex: number) => {
    setFocusedHouse({ layerIndex, position: [0, 0, 0] });
  };

  const onLogCameraPosition = () => {
    // This triggers the logging in Spiral component
    if ((window as any).__logCameraPosition) {
      (window as any).__logCameraPosition();
    }
  };

  // Check if we're in planet focus mode
  const isPlanetFocusMode = focusedHouse !== null && focusedHouse.planetIndex !== undefined;
  const focusedPlanetName = isPlanetFocusMode && focusedHouse.planetIndex !== undefined
    ? CANONICAL_PLANET_NAMES[focusedHouse.planetIndex]
    : null;

  // Determine current view mode for CueStars
  const currentViewMode: ViewMode = useMemo(() => {
    if (isEvolvingViewActive) return 'evolving';
    if (isConstellationMode || isConstellationViewOpen) return 'constellation';
    if (isPlanetFocusMode) return 'planet';
    if (focusedHouse && !isPlanetFocusMode) return 'house';
    return 'spiral';
  }, [isEvolvingViewActive, isConstellationMode, isConstellationViewOpen, isPlanetFocusMode, focusedHouse]);

  // Debug: Log planet focus changes
  useEffect(() => {
    if (isPlanetFocusMode && focusedPlanetName) {
      console.log('🪐 Planet Focus Mode Activated:');
      console.log('  - Planet Index:', focusedHouse!.planetIndex);
      console.log('  - Planet Name:', focusedPlanetName);
      console.log('  - Layer Index:', focusedHouse!.layerIndex);
      console.log('  - CANONICAL_PLANET_NAMES array:', CANONICAL_PLANET_NAMES);
      console.log('  - CANONICAL_PLANET_NAMES[', focusedHouse!.planetIndex, '] =', CANONICAL_PLANET_NAMES[focusedHouse!.planetIndex]);
      console.log('  - 🔍 DETAILED CANONICAL_PLANET_NAMES:', CANONICAL_PLANET_NAMES.map((name, idx) => `${idx}: ${name}`));
    }
  }, [isPlanetFocusMode, focusedPlanetName, focusedHouse]);

  // Handle ESC key to exit focused view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isConstellationMode) {
          // Exit constellation mode and return to whole view
          console.log('⌨️ ESC pressed - exiting constellation mode to whole view');
          setIsConstellationMode(false);
          setFocusedAspect(null);
        } else if (focusedHouse) {
          // Exit house focus
          setFocusedHouse(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedHouse, isConstellationMode]);

  // Trigger view transition effects when view mode changes
  useEffect(() => {
    // Increment trigger to create particle burst
    setViewTransitionTrigger(prev => prev + 1);
    setRippleTrigger(prev => prev + 1);
  }, [currentViewMode]);

  // Calculate aspects from the enriched chart
  const detectedAspects = useMemo(() => {
    if (!chart || !chart.aspects) {
      console.log('📊 No chart aspects available');
      return [];
    }
    
    const aspects = chart.aspects.map(aspect => ({
      type: aspect.api.type,
      planet1: aspect.from.planet.name,
      planet2: aspect.to.planet.name,
      orb: aspect.api.orb,
      angle: aspect.api.angle
    }));
    
    console.log(`📊 Detected ${aspects.length} aspects from enriched chart:`, aspects);
    return aspects;
  }, [chart]);

  // Generate interpretations
  const planetInterpretations = useMemo(() => {
    if (!chart) return [];
    // Convert enriched chart to the shape expected by interpretationGenerator
    const chartData = {
      planets: chart.planets.map(ep => ({
        name: ep.planet.name,
        sign: ep.sign.name,
        house: ep.house.house
      }))
    };
    return interpretationGenerator.generateAllPlanetInterpretations(chartData);
  }, [chart]);

  const aspectInterpretations = useMemo(() => {
    if (!chart) return [];
    return interpretationGenerator.generateAllAspectInterpretations(detectedAspects);
  }, [chart, detectedAspects]);

  // Generate layer-to-planets mapping for accurate sentence generation
  const layerPlanetsMap = useMemo(() => {
    return getLayerPlanetsMap();
  }, []); // Empty deps to generate once and stay consistent

  // Handle aspect click - transition to constellation mode
  const handleAspectClick = (aspectData: any) => {
    console.log('🌟 Aspect clicked:', aspectData);
    
    // If we're not in constellation mode yet, enter it and highlight the clicked aspect (but don't show sentence yet)
    if (!isConstellationMode) {
      console.log('🌌 Entering constellation mode - highlighting aspect (no sentence yet)');
      setIsConstellationMode(true);
      setFocusedAspect(aspectData); // Set the aspect so it's highlighted
      
      // Clear the focusedAspect after a tiny delay so the sentence doesn't show
      // This keeps the aspect highlighted but prevents the sentence overlay
      setTimeout(() => {
        setFocusedAspect({ ...aspectData, noSentence: true });
      }, 50);
    } else {
      // Already in constellation mode, so clicking shows the aspect sentence
      console.log('✨ Showing aspect sentence:', aspectData.type);
      setFocusedAspect(aspectData);
    }
  };

  // Handle back from constellation mode
  const handleBackFromConstellation = () => {
    setIsConstellationMode(false);
    setFocusedAspect(null);
  };

  // Handle closing just the sentence (stay in constellation mode)
  const handleCloseSentence = () => {
    console.log('❌ Closing sentence - staying in constellation mode');
    setFocusedAspect(null);
  };

  // Navigate to previous house layer
  const handleNavigatePrevious = () => {
    if (!focusedHouse || focusedHouse.layerIndex === 0) return;
    
    console.log('⬆️ Navigating to previous layer:', focusedHouse.layerIndex - 1);
    
    setFocusedHouse({
      layerIndex: focusedHouse.layerIndex - 1,
      // DON'T set planetIndex - we want layer view, not planet view
      position: [0, 0, 0],
    });
  };

  // Navigate to next house layer
  const handleNavigateNext = () => {
    if (!focusedHouse || focusedHouse.layerIndex === 11) return;
    
    console.log('⬇️ Navigating to next layer:', focusedHouse.layerIndex + 1);
    
    setFocusedHouse({
      layerIndex: focusedHouse.layerIndex + 1,
      // DON'T set planetIndex - we want layer view, not planet view
      position: [0, 0, 0],
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p 
            className="text-white text-lg"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Generating your cosmic spiral...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    const isQuotaError = error.includes('quota') || error.includes('429');
    
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950">
        <div className="text-center space-y-6 max-w-2xl px-8">
          <div className="text-6xl mb-4">⚠️</div>
          
          {isQuotaError ? (
            <>
              <h2 className="text-2xl text-white font-light mb-2">API Quota Limit Reached</h2>
              <p className="text-purple-300 text-lg leading-relaxed">
                The monthly API quota for generating birth charts has been exceeded. 
              </p>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mt-6">
                <p className="text-purple-200 mb-4">To continue using Celestial Bodies:</p>
                <ul className="text-left text-purple-300 space-y-2 text-sm">
                  <li>• Upgrade your RapidAPI plan at <a href="https://rapidapi.com/gbattaglia/api/astrologer" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">rapidapi.com</a></li>
                  <li>• Wait for the monthly quota to reset</li>
                  <li>• Contact the developer to increase the limit</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl text-white font-light mb-2">Something Went Wrong</h2>
              <p className="text-red-400 text-lg leading-relaxed">{error}</p>
            </>
          )}
          
          {onRestart && (
            <div className="mt-8">
              <RestartButton onRestart={onRestart} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show fallback if no chart
  if (!chart) {
    return null;
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Zodiac sign name overlay - shows when house is focused */}
      <ZodiacBackgroundOverlay houseIndex={focusedHouse?.layerIndex ?? null} />
      
      {/* Default cosmic gradient background - fades when house is focused */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 transition-opacity duration-1500"
        style={{
          opacity: focusedHouse ? 0.3 : 1,
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Animated starfield effect */}
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-1500"
        style={{ opacity: focusedHouse ? 0.1 : 0.3 }}
      >
        {/* Reduced from 50 to 30 particles for performance */}
        {starfieldParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: '0.5px',
              height: '0.5px',
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
              opacity: particle.opacity,
              transform: `scale(${particle.scale})`,
            }}
          />
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        {/* 3D Zodiac backgrounds - only show in overview mode */}
        {!focusedHouse && <ZodiacBackground3D houseIndex={null} />}
        
        {/* Enhanced lighting setup for cosmic atmosphere */}
        <ambientLight intensity={0.3} color="#8b5cf6" />
        
        {/* Main key light */}
        <pointLight position={[12, 12, 12]} intensity={1.2} color="#a78bfa" />
        
        {/* Fill lights */}
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#60a5fa" />
        <pointLight position={[0, 18, 0]} intensity={0.8} color="#ec4899" />
        <pointLight position={[0, -15, 5]} intensity={0.5} color="#8b5cf6" />
        
        {/* Rim light for depth */}
        <pointLight position={[-15, 5, -10]} intensity={0.4} color="#c084fc" />
        
        {/* Dramatic top spotlight */}
        <spotLight
          position={[0, 25, 0]}
          angle={0.5}
          intensity={1}
          color="#F9C74F"
          penumbra={1}
          castShadow={false}
        />
        
        {/* Bottom accent light */}
        <spotLight
          position={[0, -20, 0]}
          angle={0.6}
          intensity={0.6}
          color="#a78bfa"
          penumbra={1}
        />
        
        <Spiral
          chart={chart}
          focusedHouse={focusedHouse}
          onPlanetClick={handlePlanetClick}
          onLayerClick={handleLayerClick}
          isFlatView={isFlatView}
          onLogCameraPosition={onLogCameraPosition}
          isConstellationMode={isConstellationMode}
          hoveredPlanetForAspects={
            isConstellationMode && focusedHouse ? {
              layerIndex: focusedHouse.layerIndex,
              planetIndex: focusedHouse.planetIndex || 0,
            } : null
          }
          onAspectClick={handleAspectClick}
          focusedAspect={focusedAspect}
          viewMode={currentViewMode}
        />
      </Canvas>

      <UIOverlay
        focusedHouse={focusedHouse}
        onClose={() => setFocusedHouse(null)}
        onNavigatePrevious={handleNavigatePrevious}
        onNavigateNext={handleNavigateNext}
        isFlatView={isFlatView}
        onToggleView={() => setIsFlatView(prev => !prev)}
        onLogCameraPosition={onLogCameraPosition}
        onOpenInterpretations={() => setIsInterpretationPanelOpen(true)}
        onOpenConstellation={() => setIsConstellationViewOpen(true)}
      />

      {/* Interpretation Panel */}
      <InterpretationPanel
        isOpen={isInterpretationPanelOpen}
        onClose={() => setIsInterpretationPanelOpen(false)}
        planetInterpretations={planetInterpretations}
        aspectInterpretations={aspectInterpretations}
        layerPlanetsMap={layerPlanetsMap}
      />

      {/* Floating Poetic Sentence */}
      <FloatingPoeticSentence 
        planetNames={PLANET_NAMES}
        isVisible={(() => {
          const visible = !isInterpretationPanelOpen && !isPlanetFocusMode && !isConstellationMode;
          console.log('📊 FloatingPoeticSentence isVisible calculation:', {
            isInterpretationPanelOpen,
            isPlanetFocusMode,
            isConstellationMode,
            focusedHouse: focusedHouse?.layerIndex,
            result: visible
          });
          return visible;
        })()}
        focusedHouseIndex={focusedHouse?.layerIndex ?? null}
        onClose={() => setFocusedHouse(null)}
        enrichedChart={chart}
      />

      {/* Planet Focus View */}
      {isPlanetFocusMode && focusedPlanetName && (() => {
        // Find the enriched planet object from the chart
        const enrichedPlanet = chart?.planets.find(
          (p) => p.planet.name === focusedPlanetName
        );
        
        if (!enrichedPlanet) return null;
        
        return (
          <PlanetPoeticOverlay
            enrichedPlanet={enrichedPlanet}
            layerIndex={focusedHouse!.layerIndex}
            onBack={() => setFocusedHouse({ layerIndex: focusedHouse!.layerIndex, position: [0, 0, 0] })}
          />
        );
      })()}

      {/* Constellation View */}
      {isConstellationViewOpen && (
        <ConstellationView
          onBack={() => setIsConstellationViewOpen(false)}
          onViewPoem={() => setIsInterpretationPanelOpen(true)}
          onPlanetClick={(planetName) => {
            // Close constellation view and optionally focus on planet
            setIsConstellationViewOpen(false);
          }}
        />
      )}

      {/* Constellation Mode Overlay */}
      {isConstellationMode && (
        <ConstellationModeOverlay
          isActive={isConstellationMode}
          focusedAspect={focusedAspect}
          onBack={handleBackFromConstellation}
          onGeneratePoem={() => setIsInterpretationPanelOpen(true)}
          onCloseSentence={handleCloseSentence}
        />
      )}

      {/* Explanatory Cue Stars - appear in all views */}
      {!isInterpretationPanelOpen && (
        <CueStarContainer viewMode={currentViewMode} />
      )}

      {/* House Layer Overlay - show house name and definition when in layer view */}
      <HouseLayerOverlay 
        layerIndex={focusedHouse?.layerIndex ?? null}
        isVisible={focusedHouse !== null && !isPlanetFocusMode && !isConstellationMode && !isInterpretationPanelOpen}
      />

      {/* Glossary Overlay */}
      <GlossaryOverlay 
        viewMode={currentViewMode}
        context={{
          focusedHouseIndex: focusedHouse?.layerIndex ?? null,
          focusedPlanetName: focusedPlanetName,
          aspectsVisible: isConstellationMode,
        }}
        isVisible={!isInterpretationPanelOpen}
      />

      {/* Glossary Constellation UI */}
      <GlossaryConstellationUI 
        viewMode={currentViewMode}
        context={{
          focusedHouseIndex: focusedHouse?.layerIndex ?? null,
          focusedPlanetName: focusedPlanetName,
          aspectsVisible: isConstellationMode,
          houseSign: focusedHouse?.layerIndex !== null && focusedHouse?.layerIndex !== undefined 
            ? chart?.houses?.[focusedHouse.layerIndex]?.sign 
            : undefined,
        }}
        isVisible={!isInterpretationPanelOpen}
      />

      {/* Share Button - bottom left, show in spiral view */}
      {currentViewMode === 'spiral' && !isInterpretationPanelOpen && (
        <ShareConstellationButton
          onCaptureconstellation={async () => null}
          constellationData={undefined}
        />
      )}

      {/* Restart Button - bottom left (right of share button), only show in spiral view */}
      {onRestart && currentViewMode === 'spiral' && !isInterpretationPanelOpen && (
        <RestartButton onRestart={onRestart} />
      )}

      {/* Evolving View - on top of everything */}
      {chart && (
        <EvolvingView 
          enrichedChart={chart} 
          isActive={isEvolvingViewActive}
        />
      )}

      {/* Evolving View Button - Top right corner */}
      {!isInterpretationPanelOpen && !isEvolvingViewActive && currentViewMode === 'spiral' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={() => setIsEvolvingViewActive(true)}
          className="fixed top-6 right-6 z-40 w-14 h-14 rounded-full backdrop-blur-xl border-2 transition-all duration-300 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(168, 85, 247, 0.2), rgba(6, 255, 165, 0.15))',
            borderColor: 'rgba(155, 93, 229, 0.5)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), 0 0 60px rgba(6, 255, 165, 0.15)',
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(6, 255, 165, 0.2)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <SpiralIcon3D size={44} animate={true} />
        </motion.button>
      )}

      {/* Close Evolving View Button */}
      {isEvolvingViewActive && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsEvolvingViewActive(false)}
          className="fixed top-6 right-6 z-50 px-6 py-3 rounded-full bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/20 text-white hover:border-white/40 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <X className="w-4 h-4" />
          <span className="text-sm">Close</span>
        </motion.button>
      )}

      {/* Share Constellation Button */}
      {isConstellationMode && (
        <ShareConstellationButton
          aspect={focusedAspect}
          className="fixed top-6 left-6 z-50 px-6 py-3 rounded-full bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/20 text-white hover:border-white/40 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        />
      )}

      {/* View Transition Effects */}
      <ViewTransitionEffect trigger={viewTransitionTrigger > 1} intensity="medium" />
      <RippleEffect trigger={rippleTrigger > 1} />
    </div>
  );
}