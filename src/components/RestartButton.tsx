import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { CelestialButton } from './ui/CelestialButton';

interface RestartButtonProps {
  onRestart: () => void;
}

export default function RestartButton({ onRestart }: RestartButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      // Auto-cancel after 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
    } else {
      onRestart();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-8 left-28 z-50"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Circular Icon Button */}
      <motion.button
        onClick={handleClick}
        className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl border-2 transition-all duration-300"
        style={{
          background: isConfirming 
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.15))',
          borderColor: isConfirming ? 'rgba(239, 68, 68, 0.5)' : 'rgba(139, 92, 246, 0.4)',
          boxShadow: isConfirming 
            ? '0 8px 32px rgba(239, 68, 68, 0.3)'
            : '0 8px 32px rgba(139, 92, 246, 0.2)',
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: isConfirming 
            ? '0 12px 40px rgba(239, 68, 68, 0.4)'
            : '0 12px 40px rgba(139, 92, 246, 0.3)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw 
          className={`w-6 h-6 ${isConfirming ? 'text-red-300' : 'text-purple-200'}`}
          style={{
            filter: isConfirming 
              ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))'
              : 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))',
          }}
        />
      </motion.button>

      {isConfirming && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg backdrop-blur-xl whitespace-nowrap"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <p 
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: '#FCA5A5',
            }}
          >
            Click again to confirm
          </p>
        </motion.div>
      )}

      {/* Hover tooltip - shows when hovering and NOT confirming */}
      {isHovering && !isConfirming && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg backdrop-blur-xl whitespace-nowrap"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(155, 93, 229, 0.4)',
            boxShadow: '0 4px 16px rgba(155, 93, 229, 0.2)',
          }}
        >
          <p 
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Restart experience
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}