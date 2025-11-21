import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import type { GlossaryItem, GlossaryCategory } from '../../contexts/GlossaryContext';

interface DriftStarProps {
  item: GlossaryItem;
  category: GlossaryCategory;
  index: number;
  position: { x: number; y: number };
  color?: string;
  onDeepView: () => void;
}

export function DriftStar({ item, category, index, position, color = '#ffffff', onDeepView }: DriftStarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const starRef = useRef<HTMLDivElement>(null);

  const displayName = item.name || item.term || `Item ${index + 1}`;
  const shortDescription = item.essence || item.description || '';
  const keywords = item.keywords?.slice(0, 3).join(' • ') || '';

  return (
    <motion.div
      ref={starRef}
      className="fixed pointer-events-auto z-[100]"
      style={{
        left: position.x,
        top: position.y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Star Node */}
      <motion.div
        className="relative cursor-pointer"
        animate={{
          scale: isHovered ? 1.3 : 1,
          rotate: isHovered ? 180 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={onDeepView}
      >
        <Sparkles
          size={16}
          style={{ color }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        />
      </motion.div>

      {/* Hover Tooltip - Short Form */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute left-8 top-0 w-64 pointer-events-none"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="rounded-lg p-3 backdrop-blur-md border border-white/20 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${color}15, ${color}05)`,
              }}
            >
              <div className="text-xs font-medium text-white/90 mb-1">
                {displayName}
              </div>
              {shortDescription && (
                <div className="text-xs text-white/70 leading-relaxed mb-2">
                  {shortDescription}
                </div>
              )}
              {keywords && (
                <div className="text-[10px] text-white/50 italic">
                  {keywords}
                </div>
              )}
              <div className="text-[10px] text-white/40 mt-2 border-t border-white/10 pt-2">
                Click for deep view
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
