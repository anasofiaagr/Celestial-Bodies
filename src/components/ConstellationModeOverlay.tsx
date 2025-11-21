import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Share2 } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import ShareConstellationButton from './ShareConstellationButton';
import { generateSentences, type TokenData } from '../utils/SentenceEngine';
import { SentenceBlock } from './SentenceBlock';
import integratedDataset from '../data/newest_integrated_dataset';
import { useChart } from '../contexts/ChartContext';
import { generateConstellationData } from '../utils/constellationData';

// Word-by-word animation component
function AnimatedSentence({ 
  text, 
  delay = 0, 
  className = "",
  wordDelay = 0.08,
  isExiting = false
}: { 
  text: string; 
  delay?: number; 
  className?: string;
  wordDelay?: number;
  isExiting?: boolean;
}) {
  const words = text.split(' ');
  const totalWords = words.length;
  
  return (
    <div className={className}>
      {words.map((word, i) => {
        // For exit: reverse the order (last word exits first)
        const exitDelay = isExiting ? (totalWords - 1 - i) * 0.05 : 0;
        
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ 
              opacity: 0, 
              y: -10, 
              filter: 'blur(4px)',
              transition: {
                delay: exitDelay,
                duration: 0.3,
                ease: [0.19, 1, 0.22, 1],
              }
            }}
            transition={{
              delay: delay + (i * wordDelay),
              duration: 0.5,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

interface ConstellationModeOverlayProps {
  isActive: boolean;
  onBack: () => void;
  onGeneratePoem: () => void;
  focusedAspect?: any;
  onCloseSentence?: () => void;
}

export default function ConstellationModeOverlay({
  isActive,
  onBack,
  focusedAspect,
  onCloseSentence,
}: ConstellationModeOverlayProps) {
  const [isExiting, setIsExiting] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const { chart } = useChart();
  const [primaryTokens, setPrimaryTokens] = useState<TokenData[]>([]);
  const [cueTokens, setCueTokens] = useState<TokenData[][]>([]);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // Generate constellation data for artifact download
  const constellationData = useMemo(() => generateConstellationData(), []);
  
  // Generate sentences when focused aspect changes
  useEffect(() => {
    if (!focusedAspect || focusedAspect.noSentence || !chart) return;

    console.log('🌟 ConstellationModeOverlay: Generating sentences for aspect:', focusedAspect.type);
    
    // Find the aspect data from the integrated dataset
    const aspectType = focusedAspect.type;
    const aspectData = integratedDataset?.aspects_library?.[aspectType];
    
    // Find planet data for the two planets in the aspect
    const fromPlanetData = integratedDataset?.planets?.find(
      (p: any) => p.name === focusedAspect.planet1
    );
    const toPlanetData = integratedDataset?.planets?.find(
      (p: any) => p.name === focusedAspect.planet2
    );

    const payload = {
      aspect: {
        type: aspectType,
        from: {
          planet: fromPlanetData
        },
        to: {
          planet: toPlanetData
        },
        color: focusedAspect.color || '#9B5DE5'
      },
      enrichedChart: chart
    };

    console.log('  - Aspect payload:', payload);

    // Generate 1 primary + 2 cue sentences
    const result = generateSentences('constellation_aspect', payload, 3);
    
    console.log('  - Generated result:', result);
    
    if (result.primary) {
      console.log('✅ Generated primary sentence with', result.primary.length, 'tokens');
      setPrimaryTokens(result.primary);
    } else {
      console.warn('⚠️ No primary sentence generated for constellation');
    }
    
    console.log('✅ Generated', result.cues.length, 'cue sentences');
    setCueTokens(result.cues);
  }, [focusedAspect, chart]);

  const handleVariableHover = (variablePath: string | null) => {
    // TODO: Implement highlighting logic for aspect lines or planets
    setHighlightedElement(variablePath);
  };
  
  if (!isActive) return null;

  return (
    <>
      {/* Parallax stars background */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <ParallaxStars />
      </div>

      {/* Shimmer background layer */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse at 40% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Home Button - top right */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}
        onClick={() => {
          console.log('🏠 Home button clicked - exiting constellation mode');
          onBack();
        }}
        className="fixed top-8 right-8 z-40 w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-xl border-2 text-white/80 hover:text-white transition-all pointer-events-auto group"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.15))',
          borderColor: 'rgba(168, 85, 247, 0.4)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Right side poetic text - NO BOX */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-30 w-[480px] pointer-events-none" style={{ overflow: 'visible' }}>
        <AnimatePresence mode="wait">
          {/* Only show sentences when focusedAspect is set AND doesn't have noSentence flag */}
          {focusedAspect && !focusedAspect.noSentence && !isExiting && (primaryTokens.length > 0 || cueTokens.length > 0) && (
            <motion.div
              key={`aspect-${focusedAspect.type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              style={{ overflow: 'visible' }}
            >
              <div className="space-y-6 text-center pointer-events-auto" style={{ overflow: 'visible' }}>
                {/* Primary Sentence */}
                {primaryTokens.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-white/95 text-xl leading-relaxed font-light drop-shadow-lg"
                    style={{ overflow: 'visible' }}
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
                    transition={{ delay: 0.8 + index * 0.4, duration: 0.8 }}
                    className={`${
                      index === 0 
                        ? 'text-white/85 text-lg' 
                        : 'text-indigo-200/80 text-base italic'
                    } leading-relaxed font-light drop-shadow-lg`}
                    style={{ overflow: 'visible' }}
                  >
                    <SentenceBlock 
                      tokens={tokens} 
                      className="text-center"
                      onVariableHover={handleVariableHover}
                    />
                  </motion.div>
                ))}

                {/* Small X Button - positioned below text */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  onClick={() => {
                    setIsExiting(true);
                    // Close the sentence but stay in constellation mode
                    setTimeout(() => {
                      if (onCloseSentence) {
                        onCloseSentence();
                      }
                      setIsExiting(false);
                    }, 400);
                  }}
                  className="mx-auto mt-8 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Button - bottom right */}
      <ShareConstellationButton
        onCaptureconstellation={async () => {
          // Get the canvas element from the constellation view
          const canvas = document.querySelector('canvas') as HTMLCanvasElement;
          if (!canvas) return null;
          
          // Return the canvas as a data URL
          return canvas.toDataURL('image/png');
        }}
        constellationData={constellationData}
      />
    </>
  );
}

// Parallax stars component
function ParallaxStars() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1 - Distant stars */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -10, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {Array.from({ length: 25 }).map((_, i) => (  /* Reduced from 50 to 25 */
          <motion.div
            key={`star-1-${i}`}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2 - Mid-distance stars */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {Array.from({ length: 15 }).map((_, i) => (  /* Reduced from 30 to 15 */
          <motion.div
            key={`star-2-${i}`}
            className="absolute w-0.5 h-0.5 bg-indigo-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3 - Close stars */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -30, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (  /* Reduced from 20 to 10 */
          <motion.div
            key={`star-3-${i}`}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.5,
              filter: 'blur(0.5px)',
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 2.5, 1],
            }}
            transition={{
              duration: 1.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 1.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}