import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface TooltipProps {
  text: string;
  position: { x: number; y: number };
  visible: boolean;
}

export function Tooltip({ text, position, visible }: TooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y - 60}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div
            className="px-4 py-2 rounded-full backdrop-blur-xl border"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7))',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="text-white text-sm whitespace-nowrap">{text}</div>
          </div>
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(0, 0, 0, 0.7)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
