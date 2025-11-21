import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ArchetypeTooltipProps {
  archetypeName: string;
  traditionalName: string;
  type?: 'planet' | 'sign';
  className?: string;
}

export default function ArchetypeTooltip({ 
  archetypeName, 
  traditionalName,
  type = 'planet',
  className = '' 
}: ArchetypeTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="underline decoration-dotted decoration-white/30 cursor-help">
        {archetypeName}
      </span>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 backdrop-blur-sm text-white rounded-md whitespace-nowrap z-50 pointer-events-none"
          >
            <div className="text-xs">
              Traditional: <span className="font-semibold">{traditionalName}</span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-black/90" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
