import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { generateSentence, type TokenData } from '../utils/SentenceEngine';
import { SentenceBlock } from './SentenceBlock';
import integratedDataset from '../data/newest_integrated_dataset';

interface Aspect {
  planetA: string;
  planetB: string;
  type: 'Conjunction' | 'Opposition' | 'Square' | 'Trine' | 'Sextile';
  strength: number;
  orb: number;
  color?: string;
}

interface ConstellationPoeticPhraseProps {
  aspect: Aspect;
  position: { x: string; y: string }; // CSS position values like "20%" or "80%"
  delay?: number;
  onClose?: () => void;
}

export default function ConstellationPoeticPhrase({
  aspect,
  position,
  delay = 0,
  onClose,
}: ConstellationPoeticPhraseProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  useEffect(() => {
    if (!aspect) return;

    // Prepare aspect payload
    const aspectPayload = {
      from: {
        planet_name: aspect.planetA,
      },
      to: {
        planet_name: aspect.planetB,
      },
      type: aspect.type,
      color: aspect.color || '#9B5DE5',
    };

    const payload = {
      aspect: aspectPayload,
    };

    const result = generateSentence('constellation_aspect', payload, 'cue');
    if (result) {
      setTokens(result.tokens);
    }
  }, [aspect]);

  const handleVariableHover = (variablePath: string | null) => {
    // TODO: Implement highlighting for aspect lines and planet nodes
    setHighlightedElement(variablePath);
  };

  if (tokens.length === 0) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay }}
          className="absolute pointer-events-auto"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            className="px-6 py-3 rounded-xl backdrop-blur-xl"
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-white/90 text-sm leading-relaxed font-light">
              <SentenceBlock 
                tokens={tokens} 
                onVariableHover={handleVariableHover}
                animateWords={true}
                wordDelay={0.15}
              />
            </div>

            {/* Small close button - only if onClose is provided */}
            {onClose && (
              <motion.button
                onClick={() => {
                  setIsExiting(true);
                  setTimeout(onClose, 400);
                }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xs">×</span>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}