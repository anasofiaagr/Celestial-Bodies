import { motion, AnimatePresence } from 'motion/react';
import { X, Home, ChevronUp, ChevronDown, Sparkles, Eye, BookOpen, Network } from 'lucide-react';
import { getHouseName } from '../utils/fluidAstrologyMappings';
import { useState, useEffect } from 'react';

// House color palette matching Spiral.tsx
const HOUSE_COLORS = [
  '#F94144', '#F3722C', '#F8961E', '#F9C74F',
  '#90BE6D', '#43AA8B', '#577590', '#277DA1',
  '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

interface UIOverlayProps {
  focusedHouse: {
    layerIndex: number;
    planetIndex?: number;
    position: [number, number, number];
  } | null;
  onClose: () => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  isFlatView: boolean;
  onToggleView: () => void;
  onLogCameraPosition: () => void;
  onOpenInterpretations: () => void;
  onOpenConstellation?: () => void;
}

export function UIOverlay({ focusedHouse, onClose, onNavigatePrevious, onNavigateNext, isFlatView, onToggleView, onLogCameraPosition, onOpenInterpretations, onOpenConstellation }: UIOverlayProps) {
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Auto-dismiss instructions after 10 seconds
  useEffect(() => {
    if (showInstructions && !focusedHouse) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [showInstructions, focusedHouse]);
  
  const houseData = focusedHouse
    ? {
        index: focusedHouse.layerIndex,
        zodiacSign: ZODIAC_SIGNS[focusedHouse.layerIndex],
        houseName: getHouseName(focusedHouse.layerIndex),
        color: HOUSE_COLORS[focusedHouse.layerIndex],
      }
    : null;

  // Check if we're in Planet View (when a planet is selected)
  const isPlanetView = focusedHouse?.planetIndex !== undefined;

  return (
    <>
      {/* Subtle Instructions - Left Side (Overview Mode Only) */}
      <AnimatePresence>
        {!focusedHouse && showInstructions && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 -translate-y-1/2 left-8 z-10"
          >
            <div
              className="relative px-5 py-3 rounded-2xl border backdrop-blur-lg max-w-[200px]"
              style={{
                background: 'rgba(139, 92, 246, 0.08)',
                borderColor: 'rgba(168, 85, 247, 0.2)',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.15)',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-500/60 hover:bg-purple-600/80 border border-purple-300/30 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Dismiss instructions"
              >
                <X className="text-white" size={12} />
              </button>
              
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="text-purple-300/80" size={16} />
                <h2 className="text-white/90 text-sm">Celestial Bodies</h2>
              </div>
              <p className="text-purple-200/70 text-xs leading-relaxed">
                Rotate & zoom to explore
                <br />
                Hover to see names
                <br />
                Click to enter
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focused Mode - Minimal Navigation */}
      <AnimatePresence>
        {focusedHouse && houseData && (
          <>
            {/* Close/Home Button */}
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                delay: 0.5,
                type: 'spring',
                stiffness: 140,
                damping: 15,
              }}
              onClick={onClose}
              className="absolute top-8 right-8 z-20 w-14 h-14 rounded-full border backdrop-blur-xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: `0 4px 20px ${houseData.color}40`,
              }}
              aria-label="Return to overview"
            >
              <Home className="text-white group-hover:scale-110 transition-transform" size={22} />
            </motion.button>

            {/* Vertical Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{
                delay: 0.7,
                type: 'spring',
                stiffness: 80,
                damping: 20,
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4"
            >
              {/* Previous/Up Button - Goes to lower house number (toward top/House 1) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigatePrevious}
                disabled={houseData.index === 0}
                className="w-16 h-16 rounded-full border-2 backdrop-blur-xl flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                style={{
                  background: houseData.index === 0 
                    ? 'rgba(0, 0, 0, 0.3)' 
                    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
                  borderColor: houseData.index === 0 ? 'rgba(255, 255, 255, 0.1)' : houseData.color,
                  boxShadow: houseData.index === 0 ? 'none' : `0 4px 20px ${houseData.color}60`,
                }}
                aria-label="Previous house"
              >
                <ChevronUp 
                  className="text-white group-hover:translate-y-[-2px] transition-transform" 
                  size={28} 
                  strokeWidth={2.5}
                />
              </motion.button>

              {/* Layer Indicator */}
              <div className="w-16 h-auto flex flex-col items-center gap-1 py-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i === houseData.index ? houseData.color : 'rgba(255, 255, 255, 0.2)',
                      transform: i === houseData.index ? 'scale(1.5)' : 'scale(1)',
                      boxShadow: i === houseData.index ? `0 0 8px ${houseData.color}` : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Next/Down Button - Goes to higher house number (toward bottom/House 12) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateNext}
                disabled={houseData.index === 11}
                className="w-16 h-16 rounded-full border-2 backdrop-blur-xl flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                style={{
                  background: houseData.index === 11 
                    ? 'rgba(0, 0, 0, 0.3)' 
                    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
                  borderColor: houseData.index === 11 ? 'rgba(255, 255, 255, 0.1)' : houseData.color,
                  boxShadow: houseData.index === 11 ? 'none' : `0 4px 20px ${houseData.color}60`,
                }}
                aria-label="Next house"
              >
                <ChevronDown 
                  className="text-white group-hover:translate-y-[2px] transition-transform" 
                  size={28}
                  strokeWidth={2.5}
                />
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
        }}
      />
      
      {/* Top gradient overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)',
        }}
      />
    </>
  );
}