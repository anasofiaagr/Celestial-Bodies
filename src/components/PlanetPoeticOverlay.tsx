import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPlanetArchetypeName } from '../utils/fluidAstrologyMappings';
import { generateSentences, type TokenData } from '../utils/SentenceEngine';
import { SentenceBlock } from './SentenceBlock';
import integratedDataset from '../data/newest_integrated_dataset';
import type { EnrichedPlanet } from '../utils/ChartEnricher';

interface PlanetPoeticOverlayProps {
  enrichedPlanet: EnrichedPlanet;
  onBack: () => void;
  layerIndex: number;
}

export default function PlanetPoeticOverlay({
  enrichedPlanet,
  onBack,
  layerIndex,
}: PlanetPoeticOverlayProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [primaryTokens, setPrimaryTokens] = useState<TokenData[]>([]);
  const [cueTokens, setCueTokens] = useState<TokenData[][]>([]);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // Safety check: if enrichedPlanet is undefined, don't render
  if (!enrichedPlanet || !enrichedPlanet.planet) {
    return null;
  }

  const archetypeName = getPlanetArchetypeName(enrichedPlanet.planet.name);

  useEffect(() => {
    if (!enrichedPlanet) return;

    console.log('🪐 PlanetPoeticOverlay: Generating sentences for planet view');
    console.log('  - Planet:', enrichedPlanet.planet.name);
    console.log('  - Layer Index:', layerIndex);
    
    // Find planet data from dataset
    const planetData = integratedDataset?.planets?.find(
      (p: any) => p.name === enrichedPlanet.planet.name
    );

    // Find house data from dataset
    const houseData = integratedDataset?.houses?.[layerIndex];

    // Find sign data from dataset
    const signData = integratedDataset?.signs?.find(
      (s: any) => s.name === enrichedPlanet.sign.name
    );

    console.log('  - Planet Data:', planetData);
    console.log('  - House Data:', houseData);
    console.log('  - Sign Data:', signData);

    const payload = {
      planet: planetData,
      house: houseData,
      sign: signData,
      enrichedChart: null
    };

    // Generate 1 primary sentence + 2 cue sentences
    const result = generateSentences('planet_focus', payload, 3);
    
    console.log('  - Generated result:', result);
    
    if (result.primary) {
      console.log('✅ Generated primary sentence with', result.primary.length, 'tokens');
      setPrimaryTokens(result.primary);
    } else {
      console.warn('⚠️ No primary sentence generated');
    }
    
    console.log('✅ Generated', result.cues.length, 'cue sentences');
    setCueTokens(result.cues);
  }, [enrichedPlanet, layerIndex]);

  const handleVariableHover = (variablePath: string | null) => {
    // TODO: Implement highlighting logic for planet, house ring, sign glyph
    setHighlightedElement(variablePath);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-start"
          style={{ overflow: 'visible' }} // Allow tooltips to overflow
        >
          {/* LEFT: Planet Poetic Column - NO BACKGROUND BOX */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-2xl h-full flex flex-col justify-center pointer-events-auto px-12"
            style={{ overflow: 'visible' }} // Allow tooltips to overflow
          >
            <div className="relative space-y-6 text-center p-8" style={{ overflow: 'visible' }}>
              {/* House Name Title */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white/90 text-xl tracking-wide drop-shadow-lg mb-6"
              >
                {enrichedPlanet.house?.name || `House ${layerIndex + 1}`}
              </motion.div>

              {/* Primary Sentence */}
              {primaryTokens.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-white/95 text-xl leading-relaxed font-light drop-shadow-lg"
                  style={{ overflow: 'visible' }} // Allow tooltips to overflow
                >
                  <SentenceBlock 
                    tokens={primaryTokens} 
                    className="text-center"
                    onVariableHover={handleVariableHover}
                  />
                </motion.div>
              )}

              {/* Cue Sentences */}
              {cueTokens.map((tokens, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.4, duration: 0.8 }}
                  className={`${
                    index === 0 
                      ? 'text-white/85 text-lg' 
                      : 'text-amber-200/80 text-base italic'
                  } leading-relaxed font-light drop-shadow-lg`}
                  style={{ overflow: 'visible' }} // Allow tooltips to overflow
                >
                  <SentenceBlock 
                    tokens={tokens} 
                    className="text-center"
                    onVariableHover={handleVariableHover}
                  />
                </motion.div>
              ))}

              {/* Small X Button - dimmed */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                onClick={() => {
                  setIsExiting(true);
                  setTimeout(onBack, 600); // Delay to allow exit animation
                }}
                className="mx-auto mt-8 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/30 hover:text-white/60 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}