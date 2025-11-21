import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { HOUSE_COLORS } from './Spiral';
import { getPlanetsInLayer } from '../utils/planetDistribution';
import type { EnrichedChart } from '../utils/ChartEnricher';
import { generateSentence, type SentenceContext, type TokenData } from '../utils/SentenceEngine';
import { SentenceBlock } from './SentenceBlock';
import integratedDataset from '../data/newest_integrated_dataset';

interface FloatingPoeticSentenceProps {
  planetNames: string[];
  isVisible: boolean;
  focusedHouseIndex: number | null;
  onClose?: () => void;
  enrichedChart?: EnrichedChart | null;
}

export default function FloatingPoeticSentence({
  planetNames,
  isVisible,
  focusedHouseIndex,
  onClose,
  enrichedChart,
}: FloatingPoeticSentenceProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // Reset isExiting when visibility or focus changes
  useEffect(() => {
    if (isVisible) {
      setIsExiting(false);
    }
  }, [isVisible, focusedHouseIndex]);

  useEffect(() => {
    if (!enrichedChart) {
      console.log('⚠️ FloatingPoeticSentence: No enrichedChart provided');
      return;
    }

    // Prepare payload based on view mode
    if (focusedHouseIndex !== null) {
      // House Layer View
      console.log('🏠 FloatingPoeticSentence: Generating sentence for House Layer View', focusedHouseIndex);
      
      // Validate house index is in valid range (0-11)
      if (focusedHouseIndex < 0 || focusedHouseIndex > 11) {
        console.error('❌ Invalid house index:', focusedHouseIndex, '(must be 0-11)');
        return;
      }
      
      const house = enrichedChart.houses?.[focusedHouseIndex];
      if (!house) {
        console.warn('⚠️ No house data found in enrichedChart for index:', focusedHouseIndex);
        return;
      }

      // Get planets in this house
      const planetsInHouse = getPlanetsInLayer(focusedHouseIndex, enrichedChart);
      
      // Find house data from dataset (should always exist for indices 0-11)
      const houseData = integratedDataset?.houses?.[focusedHouseIndex];
      
      if (!houseData) {
        console.error('❌ No house data found in dataset for index:', focusedHouseIndex);
        console.error('   Available houses:', integratedDataset?.houses?.length);
        return;
      }
      
      // Get sign data for the house cusp
      const signData = integratedDataset?.signs?.find((s: any) => s.name === house.sign);

      const payload = {
        house: houseData,
        sign: signData,
        planetsInHouse,
        enrichedChart
      };

      console.log('🏠 House Layer View payload:', { 
        houseIndex: focusedHouseIndex,
        houseName: houseData.name,
        houseEssence: houseData.essence,
        signName: house.sign, 
        planetsInHouse: planetsInHouse.map(p => p?.planet?.name || 'Unknown').filter(Boolean),
        hasHouseData: !!houseData,
        hasSignData: !!signData
      });
      
      const result = generateSentence('house_focus', payload, 'primary');
      if (result) {
        console.log('✅ Generated house layer sentence with', result.tokens.length, 'tokens:', result);
        setTokens(result.tokens);
      } else {
        console.warn('⚠️ No sentence generated for house layer view');
        setTokens([]);
      }
    } else {
      // Spiral Overview
      console.log('🌀 FloatingPoeticSentence: Generating sentence for Spiral Overview');
      // Build chart summary data
      const chartSummary = {
        dominant_element: enrichedChart.chartSummary?.dominant_element || 'Fire',
        dominant_element_phrase: enrichedChart.chartSummary?.dominant_element_phrase || 'quick sparks, heat, impulse',
        dominant_mode: enrichedChart.chartSummary?.dominant_mode || 'Cardinal',
        dominant_mode_phrase: enrichedChart.chartSummary?.dominant_mode_phrase || 'initiating new patterns',
        primary_cluster_house: {
          name: enrichedChart.chartSummary?.primary_cluster_house?.name || 'House of Emergence',
          essence: enrichedChart.chartSummary?.primary_cluster_house?.essence || 'self, emergence',
          keywords: enrichedChart.chartSummary?.primary_cluster_house?.keywords || []
        },
        signature_planet: {
          name: enrichedChart.chartSummary?.signature_planet?.name || 'Sun',
          archetype_figure_name: enrichedChart.chartSummary?.signature_planet?.archetype_figure_name || 'The Hero',
          archetype_name: enrichedChart.chartSummary?.signature_planet?.archetype_name || 'Core Self',
          essence: enrichedChart.chartSummary?.signature_planet?.essence || 'vitality'
        },
        signature_sign: {
          name: enrichedChart.chartSummary?.signature_sign?.name || 'Aries',
          archetype_name: enrichedChart.chartSummary?.signature_sign?.archetype_name || 'Fire of Beginning',
          expressions: enrichedChart.chartSummary?.signature_sign?.expressions || []
        },
        aspect_mood: enrichedChart.chartSummary?.aspect_mood || 'dynamic',
        aspect_keywords: enrichedChart.chartSummary?.aspect_keywords || ['tension', 'flow']
      };

      const payload = {
        chart: chartSummary,
        enrichedChart
      };

      const result = generateSentence('spiral_overview', payload, 'primary');
      if (result) {
        console.log('✅ Generated spiral overview sentence:', result);
        setTokens(result.tokens);
      } else {
        console.warn('⚠️ No sentence generated for spiral overview');
      }
    }
  }, [focusedHouseIndex, enrichedChart]);

  const handleClose = () => {
    if (onClose) {
      setIsExiting(true);
      setTimeout(onClose, 600);
    }
  };

  const handleVariableHover = (variablePath: string | null) => {
    // TODO: Implement highlighting logic for spiral elements
    // This will pulse house rings, planet nodes, or sign glyphs
    setHighlightedElement(variablePath);
  };

  console.log('🔍 FloatingPoeticSentence render state:', {
    isVisible,
    focusedHouseIndex,
    tokensLength: tokens.length,
    tokens: tokens.map(t => ({ text: t.text, isVariable: t.isVariable })),
    willRender: tokens.length > 0 && isVisible && !isExiting
  });

  if (tokens.length === 0) {
    console.log('⚠️ FloatingPoeticSentence: Not rendering - no tokens');
    console.log('   - focusedHouseIndex:', focusedHouseIndex);
    console.log('   - isVisible:', isVisible);
    console.log('   - enrichedChart exists:', !!enrichedChart);
    return null;
  }
  if (!isVisible) {
    console.log('⚠️ FloatingPoeticSentence: Not rendering - isVisible is false');
    console.log('   - tokens.length:', tokens.length);
    console.log('   - focusedHouseIndex:', focusedHouseIndex);
    return null;
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`fixed inset-0 z-40 pointer-events-none ${ 
            focusedHouseIndex !== null 
              ? 'flex items-start justify-center pt-16' // House Layer View: top center
              : 'flex items-center justify-end pr-12' // Spiral View: right side with padding
          }`}
          style={{ overflow: 'visible' }} // Allow tooltips to overflow
        >
          {/* Poetic Sentence Panel */}
          <motion.div
            initial={{ opacity: 0, x: focusedHouseIndex !== null ? 0 : 50, y: focusedHouseIndex !== null ? -30 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: focusedHouseIndex !== null ? 0 : 50, y: focusedHouseIndex !== null ? -30 : 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`${ 
              focusedHouseIndex !== null 
                ? 'w-full max-w-3xl px-12' // Wider for house layer view
                : 'max-w-lg' // Expanded for spiral view - more comfortable reading width
            }`}
            style={{ 
              overflow: 'visible', 
              pointerEvents: 'auto',
              maxHeight: focusedHouseIndex === null ? '60vh' : 'auto' // Limit vertical height for spiral view
            }}
          >
            <div className="relative space-y-6 text-center p-8" style={{ overflow: 'visible' }}>
              {/* View Mode Label */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`text-xs tracking-widest uppercase opacity-50 mb-2 ${
                  focusedHouseIndex !== null ? 'text-purple-400' : 'text-cyan-400'
                }`}
              >
                {focusedHouseIndex === null ? '✦ Spiral View ✦' : '✦ House Layer View ✦'}
              </motion.div>

              {/* Sentence */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="text-white/95 text-xl leading-relaxed font-light drop-shadow-lg pointer-events-auto"
                style={{ overflow: 'visible' }} // Allow tooltips to overflow
              >
                <SentenceBlock 
                  tokens={tokens} 
                  className="text-center"
                  onVariableHover={handleVariableHover}
                />
              </motion.div>

              {/* Close Button (only if onClose is provided) */}
              {onClose && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  onClick={handleClose}
                  className="mx-auto mt-8 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}