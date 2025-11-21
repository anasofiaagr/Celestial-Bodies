// EvolvingView.tsx
// Evolving View Mode: Central core sentence with orbiting fragments

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateEvolvingCore, 
  generateEvolvingFragments,
  regenerateEvolvingFragment,
  type EvolvingCore,
  type EvolvingFragment
} from '../utils/SentenceEngine';
import { RefreshCw } from 'lucide-react';

interface EvolvingViewProps {
  enrichedChart: any;
  isActive: boolean;
}

export function EvolvingView({ enrichedChart, isActive }: EvolvingViewProps) {
  const [coreSentence, setCoreSentence] = useState<EvolvingCore | null>(null);
  const [fragments, setFragments] = useState<EvolvingFragment[]>([]);
  const [hoveredFragmentId, setHoveredFragmentId] = useState<string | null>(null);
  const [expandedFragmentId, setExpandedFragmentId] = useState<string | null>(null);

  // Generate core sentence and fragments on mount
  useEffect(() => {
    if (isActive && enrichedChart) {
      console.log('🌟 Generating evolving view content...', { isActive, enrichedChart });
      
      const core = generateEvolvingCore(enrichedChart);
      const frags = generateEvolvingFragments(enrichedChart);
      
      console.log('🌟 Generated core:', core);
      console.log('🌟 Generated fragments:', frags);
      
      setCoreSentence(core);
      setFragments(frags);
    }
  }, [isActive, enrichedChart]);

  // Handle regenerate fragment
  const handleRegenerateFragment = (fragment: EvolvingFragment) => {
    const regenerated = regenerateEvolvingFragment(fragment, enrichedChart);
    if (regenerated) {
      setFragments(prev => 
        prev.map(f => f.id === fragment.id ? regenerated : f)
      );
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Background dim overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Core Sentence (Center) */}
      {coreSentence && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="max-w-2xl px-8 py-6 text-center">
            <p className="text-white/95 text-2xl leading-relaxed tracking-wide">
              {coreSentence.sentence}
            </p>
            <div className="mt-4 text-white/40 text-sm">
              {coreSentence.sourceTriad.planet} · {coreSentence.sourceTriad.sign} · {coreSentence.sourceTriad.house}
            </div>
          </div>
        </motion.div>
      )}

      {/* Orbiting Fragments */}
      <div className="absolute inset-0 pointer-events-none">
        {fragments.map((fragment, index) => {
          const angle = (index / fragments.length) * Math.PI * 2;
          const radius = 280; // Distance from center
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const isExpanded = expandedFragmentId === fragment.id;
          const isHovered = hoveredFragmentId === fragment.id;

          return (
            <motion.div
              key={fragment.id}
              className="absolute left-1/2 top-1/2 pointer-events-auto"
              style={{
                x: x - 60, // Center the element
                y: y - 30
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: [0, 5, -5, 0],
                transition: {
                  opacity: { delay: 0.3 + index * 0.1 },
                  scale: { delay: 0.3 + index * 0.1 },
                  rotate: {
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }
              }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <div
                className="relative cursor-pointer group"
                onMouseEnter={() => {
                  setHoveredFragmentId(fragment.id);
                  setExpandedFragmentId(fragment.id);
                }}
                onMouseLeave={() => {
                  setHoveredFragmentId(null);
                  setExpandedFragmentId(null);
                }}
              >
                {/* Camouflaged capsule */}
                <AnimatePresence>
                  {!isExpanded && (
                    <motion.div
                      className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-white/70 text-sm tracking-wide">
                        {fragment.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded poem */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="absolute top-0 left-0"
                      style={{ width: 320 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Star particle effect */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: '50%',
                              top: '50%',
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: Math.cos(i * 30 * Math.PI / 180) * 60,
                              y: Math.sin(i * 30 * Math.PI / 180) * 60,
                            }}
                            transition={{
                              duration: 0.8,
                              ease: 'easeOut'
                            }}
                          />
                        ))}
                      </div>

                      {/* Poem card */}
                      <div className="relative bg-black/80 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-2xl">
                        <p className="text-white/90 text-base leading-relaxed">
                          {fragment.poem}
                        </p>
                        
                        {/* Regenerate button */}
                        <button
                          className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegenerateFragment(fragment);
                          }}
                        >
                          <RefreshCw className="w-3 h-3 text-white/60" />
                        </button>

                        {/* Source info */}
                        {fragment.sourceContext?.planetIds && (
                          <div className="mt-3 text-white/30 text-xs">
                            {fragment.sourceContext.planetIds[0]}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
