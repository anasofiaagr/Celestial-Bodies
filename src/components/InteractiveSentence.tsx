// InteractiveSentence.tsx
// Component for rendering poetic sentences with interactive hover tooltips

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type HoverData = {
  title: string;
  summary: string;
  fallback: string;
  color?: string;
};

type TokenData = {
  text: string;
  isVariable: boolean;
  variableName?: string;
  hoverData?: HoverData;
};

interface InteractiveSentenceProps {
  tokens: TokenData[];
  className?: string;
}

export default function InteractiveSentence({
  tokens,
  className = "",
}: InteractiveSentenceProps) {
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (
    variableName: string,
    e: React.MouseEvent<HTMLSpanElement>
  ) => {
    setHoveredToken(variableName);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredToken(null);
  };

  const hoveredTokenData = tokens.find((t) => t.variableName === hoveredToken);

  return (
    <>
      <div className={className}>
        {tokens.map((token, index) => {
          if (!token.isVariable || !token.hoverData) {
            return <span key={index}>{token.text}</span>;
          }

          const isHovered = hoveredToken === token.variableName;
          const color = token.hoverData.color || "#9B5DE5";

          return (
            <span
              key={index}
              className="relative cursor-help transition-all duration-200"
              style={{
                textDecoration: "underline",
                textDecorationColor: `${color}60`,
                textUnderlineOffset: "3px",
                color: isHovered ? color : "inherit",
                textShadow: isHovered ? `0 0 12px ${color}50` : "none",
              }}
              onMouseEnter={(e) =>
                handleMouseEnter(token.variableName!, e)
              }
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Floating tooltip */}
      <AnimatePresence>
        {hoveredToken && hoveredTokenData?.hoverData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.12 }}
            className="fixed z-[100] pointer-events-none"
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y - 20,
            }}
          >
            <div
              className="px-4 py-3 rounded-xl backdrop-blur-xl border shadow-2xl max-w-sm"
              style={{
                backgroundColor: "rgba(6, 6, 12, 0.88)",
                borderColor: "rgba(255, 255, 255, 0.12)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
              }}
            >
              {/* Title */}
              <div
                className="text-xs uppercase tracking-wider mb-1.5 opacity-70"
                style={{
                  color: hoveredTokenData.hoverData.color || "#9B5DE5",
                }}
              >
                {hoveredTokenData.hoverData.title}
              </div>
              
              {/* Summary */}
              <p className="text-sm leading-relaxed" style={{ color: "#EFEFF6" }}>
                {hoveredTokenData.hoverData.summary || hoveredTokenData.hoverData.fallback}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}