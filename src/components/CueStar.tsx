import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CueStarProps {
  title: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
  delay?: number;
}

export function CueStar({ title, text, position, delay = 0 }: CueStarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="fixed pointer-events-auto z-50"
      style={{ 
        bottom: `calc(24px - ${position.y}px)`,
        right: `calc(24px - ${position.x}px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // STATE A: Collapsed Star
          <motion.div
            key="star"
            className="relative cursor-help"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 0.8,
              y: [0, -4, 0],
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              scale: { duration: 0.2 },
              opacity: { duration: 0.2 },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            {/* Pulsing outer glow */}
            <motion.div 
              className="absolute inset-0 blur-xl bg-cyan-400/30 rounded-full w-10 h-10 -translate-x-1.5 -translate-y-1.5"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Inner glow */}
            <div className="absolute inset-0 blur-md bg-cyan-400/40 rounded-full w-7 h-7" />
            
            {/* Star icon container */}
            <div className="relative w-7 h-7 flex items-center justify-center bg-slate-900/70 rounded-full border border-cyan-400/40 shadow-lg">
              <Sparkles className="w-4 h-4 text-cyan-300" strokeWidth={2.5} />
            </div>
          </motion.div>
        ) : (
          // STATE B: Expanded Explanation Bubble
          <motion.div
            key="bubble"
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
            style={{
              // Position bubble to the left and up from the star
              transform: 'translate(-100%, -50%)',
              marginRight: '12px'
            }}
          >
            {/* Nebula halo */}
            <div className="absolute inset-0 blur-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl" />
            
            {/* Panel */}
            <div 
              className="relative w-72 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-2xl"
              style={{
                background: 'rgba(10, 10, 20, 0.85)'
              }}
            >
              {/* Title */}
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <h4 className="text-cyan-300 text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                  {title}
                </h4>
              </div>

              {/* Explanation text */}
              <p className="text-white/80 text-xs leading-relaxed">
                {text}
              </p>

              {/* Soft bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 rounded-b-2xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}