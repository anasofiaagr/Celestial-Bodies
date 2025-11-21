// SentenceBlock.tsx
// Component for rendering poetic sentences with interactive hover tooltips

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import type { TokenData } from '../utils/SentenceEngine';

interface SentenceBlockProps {
  tokens: TokenData[];
  className?: string;
  onVariableHover?: (variablePath: string | null) => void;
  animateWords?: boolean; // New prop to enable sequential word animation
  wordDelay?: number; // Delay between each word in seconds
}

export function SentenceBlock({ tokens, className = '', onVariableHover, animateWords = false, wordDelay = 0.1 }: SentenceBlockProps) {
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const elementRefs = useRef<Record<string, HTMLElement>>({});

  const handleMouseEnter = (e: React.MouseEvent, variablePath: string) => {
    const token = tokens.find(t => t.variablePath === variablePath);
    if (token) {
      console.log('🖱️ Hovering on variable:', token.variablePath);
      console.log('  - Token text:', token.text);
      console.log('  - Hover data:', token.hoverData);
      setHoveredToken(token.variablePath);
      
      // Get the bounding rect of the hovered element
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      console.log('  - Element rect:', rect);
      
      setTooltipPosition({
        x: rect.left + rect.width / 2, // Center of the element
        y: rect.top - 10 // 10px above the element
      });
      onVariableHover?.(token.variablePath);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hoveredToken) return;
    
    // Update position on mouse move to keep it accurate
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    setTooltipPosition({
      x: rect.left + rect.width / 2, // Center of the element
      y: rect.top - 10 // 10px above the element
    });
  };

  const handleMouseLeave = () => {
    setHoveredToken(null);
    onVariableHover?.(null);
  };

  return (
    <>
      <div className={`inline ${className}`}>
        {tokens.map((token, idx) => {
          const baseDelay = animateWords ? idx * wordDelay : 0;
          
          if (!token.isVariable) {
            return animateWords ? (
              <motion.span 
                key={idx} 
                className="inline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: baseDelay }}
              >
                {token.text}
              </motion.span>
            ) : (
              <span key={idx} className="inline">
                {token.text}
              </span>
            );
          }

          return animateWords ? (
            <motion.span
              key={idx}
              ref={el => {
                if (el && token.variablePath) {
                  elementRefs.current[token.variablePath] = el;
                }
              }}
              className="inline cursor-help transition-all duration-200"
              style={{
                color: token.color || '#9B5DE5',
                textShadow: `0 0 12px ${token.color || '#9B5DE5'}40`,
                fontWeight: 500,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: baseDelay }}
              onMouseEnter={(e) => handleMouseEnter(e, token.variablePath!)}
              onMouseLeave={handleMouseLeave}
            >
              {token.text}
            </motion.span>
          ) : (
            <span
              key={idx}
              ref={el => {
                if (el && token.variablePath) {
                  elementRefs.current[token.variablePath] = el;
                }
              }}
              className="inline cursor-help transition-all duration-200"
              style={{
                color: token.color || '#9B5DE5',
                textShadow: `0 0 12px ${token.color || '#9B5DE5'}40`,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => handleMouseEnter(e, token.variablePath!)}
              onMouseLeave={handleMouseLeave}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Tooltip - Rendered in a portal to escape any clipping contexts */}
      {hoveredToken && (() => {
        const token = tokens.find((t) => t.variablePath === hoveredToken);
        if (!token?.hoverData) {
          console.log('⚠️ SentenceBlock: No hover data for token:', hoveredToken);
          console.log('  - Available tokens:', tokens.map(t => ({ path: t.variablePath, hasHoverData: !!t.hoverData })));
          return null;
        }

        console.log('✨ SentenceBlock: Rendering tooltip at position:', tooltipPosition);
        console.log('  - Token:', token.text);
        console.log('  - Hover data:', token.hoverData);

        const tooltipElement = (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
              className="fixed pointer-events-none"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: 'translate(-50%, -100%)', // Center horizontally, position above
                maxWidth: '280px',
                zIndex: 99999, // Much higher z-index
              }}
            >
              <div
                className="px-3.5 py-2.5 rounded-lg shadow-2xl"
                style={{
                  background: 'rgba(4, 4, 8, 0.98)',
                  border: '1.5px solid rgba(155, 93, 229, 0.5)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.8), 0 0 30px rgba(155, 93, 229, 0.4)',
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-wider mb-1 font-medium"
                  style={{ color: '#9B5DE5' }}
                >
                  {token.hoverData.title}
                </div>
                <div
                  className="text-xs leading-snug"
                  style={{ color: '#EFEFF6' }}
                >
                  {token.hoverData.summary}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        );

        // Render tooltip in a portal to document.body to escape any clipping contexts
        return createPortal(tooltipElement, document.body);
      })()}
    </>
  );
}