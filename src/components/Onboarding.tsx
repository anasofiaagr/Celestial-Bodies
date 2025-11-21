import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';
import { CelestialButton } from './ui/CelestialButton';

interface OnboardingProps {
  onComplete: () => void;
}

// Word-by-word animation component
function WordByWord({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const words = text.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    setVisibleWords(0);
    hasCompletedRef.current = false;

    const interval = setInterval(() => {
      setVisibleWords((prev) => {
        if (prev >= words.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 180); // 180ms per word

    return () => clearInterval(interval);
  }, [text, words.length]);

  // Separate effect for completion callback
  useEffect(() => {
    if (visibleWords >= words.length && !hasCompletedRef.current && onComplete) {
      hasCompletedRef.current = true;
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, words.length, onComplete]);

  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: i < visibleWords ? 1 : 0,
            y: i < visibleWords ? 0 : 10,
          }}
          transition={{ duration: 0.4 }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const nextScreen = () => {
    setShowButton(false);
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Pure black background to match spiral space */}
      <div className="absolute inset-0 bg-black">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {currentScreen === 0 && (
              <TitleScreen
                key="screen-0"
                onNext={nextScreen}
              />
            )}
            {currentScreen === 1 && (
              <PhraseScreen
                key="screen-1"
                onNext={nextScreen}
                showButton={showButton}
                setShowButton={setShowButton}
              />
            )}
            {currentScreen === 2 && (
              <TextScreen
                key="screen-2"
                onNext={nextScreen}
                showButton={showButton}
                setShowButton={setShowButton}
              />
            )}
          </AnimatePresence>

          {/* Progress indicators */}
          <motion.div
            className="flex justify-center gap-3 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-0.5 rounded-full transition-all duration-700 ${
                  i === currentScreen
                    ? 'w-16 bg-purple-300'
                    : 'w-8 bg-purple-900'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// TITLE SCREEN
function TitleScreen({
  onNext,
}: {
  onNext: () => void;
}) {
  const [showTitle, setShowTitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  // Rainbow colors from house layers
  const rainbowColors = [
    '#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#43AA8B',
    '#577590', '#277DA1', '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'
  ];
  
  const title = "Celestial Bodies";
  const letters = title.split('');
  
  useEffect(() => {
    setShowTitle(true);
    const timeout = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center flex flex-col items-center justify-center"
      style={{ minHeight: '400px' }}
    >
      {/* Rainbow letter title */}
      <div className="mb-12">
        <div 
          style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={showTitle ? { 
                opacity: 1, 
                y: 0,
                filter: 'blur(0px)'
              } : {}}
              transition={{ 
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.19, 1, 0.22, 1]
              }}
              style={{ 
                color: letter === ' ' ? 'transparent' : rainbowColors[i % rainbowColors.length],
                textShadow: letter === ' ' ? 'none' : `0 0 20px ${rainbowColors[i % rainbowColors.length]}60, 0 0 40px ${rainbowColors[i % rainbowColors.length]}30`,
                marginRight: letter === ' ' ? '0.3em' : '0',
                display: 'inline-block'
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Start Experience Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <CelestialButton
              onClick={onNext}
              variant="primary"
              size="lg"
            >
              Start Experience
            </CelestialButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// PHRASE SCREEN
function PhraseScreen({
  onNext,
  showButton,
  setShowButton,
}: {
  onNext: () => void;
  showButton: boolean;
  setShowButton: (show: boolean) => void;
}) {
  const words = [
    { text: "Identity", line: 0, wordIndex: 0 },
    { text: "is", line: 0, wordIndex: 1 },
    { text: "not", line: 0, wordIndex: 2 },
    { text: "fixed.", line: 0, wordIndex: 3 },
    { text: "Neither", line: 1, wordIndex: 0 },
    { text: "are", line: 1, wordIndex: 1 },
    { text: "the", line: 1, wordIndex: 2 },
    { text: "skies", line: 1, wordIndex: 3 },
    { text: "we", line: 1, wordIndex: 4 },
    { text: "look", line: 1, wordIndex: 5 },
    { text: "at.", line: 1, wordIndex: 6 },
  ];
  
  // Scattered initial positions for each word (percentage-based)
  const scatteredPositions = [
    { x: 15, y: 10 },   // Identity
    { x: 75, y: 15 },   // is
    { x: 25, y: 25 },   // not
    { x: 85, y: 30 },   // fixed
    { x: 10, y: 45 },   // Neither
    { x: 60, y: 50 },   // are
    { x: 90, y: 60 },   // the
    { x: 20, y: 70 },   // skies
    { x: 70, y: 75 },   // we
    { x: 40, y: 85 },   // look
    { x: 85, y: 90 },   // at
  ];
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dissolvedIndices, setDissolvedIndices] = useState<Set<number>>(new Set());
  const [textHoveredIndex, setTextHoveredIndex] = useState<number | null>(null);
  const [dustParticles, setDustParticles] = useState<{ id: number; x: number; y: number; segmentId: number }[]>([]);
  const [showCenteredText, setShowCenteredText] = useState(false);
  
  useEffect(() => {
    // Auto-show button after a delay
    const timeout = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(timeout);
  }, [setShowButton]);
  
  // Trigger centered text once all words are dissolved
  useEffect(() => {
    if (dissolvedIndices.size === words.length) {
      const timeout = setTimeout(() => {
        setShowCenteredText(true);
      }, 800); // Short delay after last word dissolves
      return () => clearTimeout(timeout);
    }
  }, [dissolvedIndices.size, words.length]);
  
  const handleHover = (index: number) => {
    setHoveredIndex(index);
    setDissolvedIndices(prev => new Set(prev).add(index));
  };

  const handleTextHover = (segmentId: number, event: React.MouseEvent) => {
    if (!dissolvedIndices.has(segmentId)) return;
    
    setTextHoveredIndex(segmentId);
    
    // Generate star dust particles
    const rect = event.currentTarget.getBoundingClientRect();
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i + Math.random() * 1000,
      x: event.clientX - rect.left + (Math.random() - 0.5) * 100,
      y: event.clientY - rect.top + (Math.random() - 0.5) * 100,
      segmentId
    }));
    
    setDustParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setDustParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  };

  // Generate constellation stars for each word
  const generateStars = (wordLength: number, seed: number) => {
    const starCount = Math.max(4, Math.min(8, wordLength + 2));
    const stars: { x: number; y: number }[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const angle = ((i + seed) * 137.5) % 360;
      const radius = 20 + ((i * 13 + seed) % 30);
      stars.push({
        x: Math.cos(angle * Math.PI / 180) * radius,
        y: Math.sin(angle * Math.PI / 180) * radius
      });
    }
    
    return stars;
  };

  const allDissolved = dissolvedIndices.size === words.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center relative"
      style={{ minHeight: '600px' }}
    >
      {/* Scattered words with constellations */}
      <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
        {words.map((word, i) => {
          const stars = generateStars(word.text.length, i);
          const isDissolved = dissolvedIndices.has(i);
          const isHovered = hoveredIndex === i;
          const isTextHovered = textHoveredIndex === i;
          
          return (
            <React.Fragment key={i}>
              <motion.div
                className="absolute"
                initial={{ 
                  left: `${scatteredPositions[i].x}%`,
                  top: `${scatteredPositions[i].y}%`
                }}
                animate={{
                  left: `${scatteredPositions[i].x}%`,
                  top: `${scatteredPositions[i].y}%`,
                  opacity: showCenteredText ? 0 : 1,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.19, 1, 0.22, 1]
                }}
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  zIndex: isHovered ? 100 : 10,
                  pointerEvents: showCenteredText ? 'none' : 'auto'
                }}
              >
                {/* The actual text - hidden until dissolved, then fades out when centered text shows */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: showCenteredText ? 0 : (isDissolved ? 1 : 0),
                  }}
                  transition={{ duration: 0.6 }}
                  onMouseEnter={(e) => handleTextHover(i, e)}
                  onMouseMove={(e) => {
                    if (isTextHovered) {
                      handleTextHover(i, e);
                    }
                  }}
                  onMouseLeave={() => setTextHoveredIndex(null)}
                  style={{
                    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    letterSpacing: '-0.01em',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    padding: '0.5rem 1rem',
                  }}
                >
                  <motion.span
                    animate={{
                      opacity: isTextHovered ? 0.3 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {word.text}
                  </motion.span>
                  
                  {/* Star dust particles - appear when hovering text */}
                  {dustParticles
                    .filter((p) => p.segmentId === i)
                    .map((particle) => (
                      <motion.div
                        key={particle.id}
                        className="absolute rounded-full pointer-events-none"
                        initial={{
                          x: particle.x,
                          y: particle.y,
                          opacity: 1,
                          scale: 1,
                          width: 2 + Math.random() * 3,
                          height: 2 + Math.random() * 3,
                        }}
                        animate={{
                          x: particle.x + (Math.random() - 0.5) * 80,
                          y: particle.y - 50 - Math.random() * 60,
                          opacity: 0,
                          scale: 0,
                        }}
                        transition={{
                          duration: 0.8 + Math.random() * 0.4,
                          ease: 'easeOut'
                        }}
                        style={{
                          background: `radial-gradient(circle, ${
                            Math.random() > 0.5 ? 'rgba(167, 139, 250, 1)' : 'rgba(199, 175, 255, 1)'
                          }, transparent)`,
                          boxShadow: '0 0 6px rgba(167, 139, 250, 0.8)',
                        }}
                      />
                    ))}
                </motion.div>
                
                {/* Constellation overlay - stays visible until word is dissolved */}
                <motion.svg
                  className="absolute pointer-events-none"
                  style={{
                    width: '200px',
                    height: '120px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: isDissolved ? 0 : (isHovered ? 0.3 : 1),
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Constellation lines */}
                  {stars.map((star, idx) => {
                    if (idx === stars.length - 1) return null;
                    return (
                      <motion.line
                        key={`line-${idx}`}
                        x1={100 + star.x}
                        y1={60 + star.y}
                        x2={100 + stars[idx + 1].x}
                        y2={60 + stars[idx + 1].y}
                        stroke="rgba(167, 139, 250, 0.4)"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ 
                          pathLength: 1,
                          opacity: isDissolved ? 0 : (isHovered ? 0.2 : 0.4)
                        }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    );
                  })}
                  
                  {/* Constellation stars */}
                  {stars.map((star, idx) => (
                    <motion.circle
                      key={`star-${idx}`}
                      cx={100 + star.x}
                      cy={60 + star.y}
                      r={isHovered ? 3 : 2}
                      fill="white"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: isDissolved ? 0 : (isHovered ? 0.6 : 1),
                        scale: isDissolved ? 0 : 1,
                      }}
                      transition={{ 
                        duration: 0.6,
                        delay: i * 0.1 + idx * 0.05
                      }}
                    >
                      <animate
                        attributeName="r"
                        values={isHovered ? "3;4;3" : "2;3;2"}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </motion.circle>
                  ))}\n                </motion.svg>
              </motion.div>
            </React.Fragment>
          );
        })}
        
        {/* Properly formatted centered text - fades in after scattered words fade out */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: 'translate(-50%, -50%)',
            pointerEvents: showCenteredText ? 'auto' : 'none'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showCenteredText ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            <div>Identity is not fixed.</div>
            <div>Neither are the skies we look at.</div>
          </div>
        </motion.div>
      </div>

      {/* Button - fixed position */}
      <div className="h-20 flex items-center justify-center mt-8">
        <AnimatePresence>
          {showButton && (
            <motion.button
              onClick={onNext}
              className="group relative text-white hover:text-purple-300 transition-colors duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -2 }}
              style={{ 
                fontSize: '1.125rem', 
                letterSpacing: '0.02em',
                fontFamily: 'var(--font-body)',
                textTransform: 'none'
              }}
            >
              Continue
              <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// TEXT SCREEN
function TextScreen({
  onNext,
  showButton,
  setShowButton,
}: {
  onNext: () => void;
  showButton: boolean;
  setShowButton: (show: boolean) => void;
}) {
  // Text segments with scattered positions
  const textSegments = [
    { 
      text: "This project blends ",
      order: 0,
      scatteredX: 12,
      scatteredY: 15
    },
    { 
      text: "symbolic systems",
      highlight: true,
      order: 1,
      scatteredX: 75,
      scatteredY: 18
    },
    { 
      text: "—planets, signs, houses—",
      order: 2,
      scatteredX: 35,
      scatteredY: 28
    },
    { 
      text: "with contemporary design, ",
      order: 3,
      scatteredX: 85,
      scatteredY: 35
    },
    { 
      text: "relational identity thinking",
      highlight: true,
      order: 4,
      scatteredX: 18,
      scatteredY: 48
    },
    { 
      text: ", and ",
      order: 5,
      scatteredX: 70,
      scatteredY: 52
    },
    { 
      text: "fluid interpretation",
      highlight: true,
      order: 6,
      scatteredX: 25,
      scatteredY: 65
    },
    { 
      text: ". The interface transforms your chart into ",
      order: 7,
      scatteredX: 78,
      scatteredY: 68
    },
    { 
      text: "shapes, rhythms, and language",
      highlight: true,
      order: 8,
      scatteredX: 40,
      scatteredY: 82
    }
  ];
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dissolvedIndices, setDissolvedIndices] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    // Auto-show button after a delay
    const timeout = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(timeout);
  }, []);
  
  const handleHover = (index: number) => {
    setHoveredIndex(index);
    setDissolvedIndices(prev => new Set(prev).add(index));
  };

  // Generate constellation stars for each segment
  const generateStars = (textLength: number, seed: number) => {
    const starCount = Math.max(5, Math.min(10, Math.floor(textLength / 3)));
    const stars: { x: number; y: number }[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const angle = ((i + seed) * 137.5) % 360;
      const radius = 15 + ((i * 17 + seed) % 25);
      stars.push({
        x: Math.cos(angle * Math.PI / 180) * radius,
        y: Math.sin(angle * Math.PI / 180) * radius
      });
    }
    
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center relative"
      style={{ minHeight: '600px' }}
    >
      {/* Container for both scattered constellations and centered text */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-8" style={{ minHeight: '450px' }}>
        
        {/* Scattered constellation positions with SVG overlays */}
        {textSegments.map((segment) => {
          const stars = generateStars(segment.text.length, segment.order);
          const isDissolved = dissolvedIndices.has(segment.order);
          const isHovered = hoveredIndex === segment.order;
          
          return (
            <motion.div
              key={segment.order}
              className="absolute"
              initial={{
                left: `${segment.scatteredX}%`,
                top: `${segment.scatteredY}%`
              }}
              animate={{
                left: isDissolved ? '50%' : `${segment.scatteredX}%`,
                top: isDissolved ? '50%' : `${segment.scatteredY}%`,
              }}
              transition={{
                duration: 1.5,
                ease: [0.19, 1, 0.22, 1]
              }}
              style={{
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 100 : 10
              }}
            >
              {/* Larger hitbox for easier hovering */}
              <div
                onMouseEnter={() => handleHover(segment.order)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  cursor: 'pointer',
                  width: '200px',
                  height: '120px',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Constellation overlay */}
                <motion.svg
                  className="absolute pointer-events-none"
                  style={{
                    width: '180px',
                    height: '100px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: isDissolved ? 0 : (isHovered ? 0.3 : 1),
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Constellation lines */}
                  {stars.map((star, idx) => {
                    if (idx === stars.length - 1) return null;
                    return (
                      <motion.line
                        key={`line-${segment.order}-${idx}`}
                        x1={90 + star.x}
                        y1={50 + star.y}
                        x2={90 + stars[idx + 1].x}
                        y2={50 + stars[idx + 1].y}
                        stroke="rgba(167, 139, 250, 0.3)"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ 
                          pathLength: 1,
                          opacity: isDissolved ? 0 : (isHovered ? 0.15 : 0.3)
                        }}
                        transition={{ duration: 1.5, delay: segment.order * 0.15 }}
                      />
                    );
                  })}
                  
                  {/* Constellation stars */}
                  {stars.map((star, idx) => (
                    <motion.circle
                      key={`star-${segment.order}-${idx}`}
                      cx={90 + star.x}
                      cy={50 + star.y}
                      r={isHovered ? 2.5 : 1.5}
                      fill="white"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: isDissolved ? 0 : (isHovered ? 0.5 : 0.8),
                        scale: isDissolved ? 0 : 1,
                      }}
                      transition={{ 
                        duration: 0.7,
                        delay: segment.order * 0.1 + idx * 0.05
                      }}
                    >
                      <animate
                        attributeName="r"
                        values={isHovered ? "2.5;3.5;2.5" : "1.5;2.5;1.5"}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </motion.circle>
                  ))}
                </motion.svg>
              </div>
            </motion.div>
          );
        })}

        {/* Centered text area - revealed segments fly here */}
        <div 
          className="absolute left-1/2 top-1/2"
          style={{
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '900px'
          }}
        >
          <div 
            className="leading-relaxed text-center"
            style={{ 
              fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              letterSpacing: '0.01em'
            }}
          >
            {textSegments.map((segment) => {
              const isDissolved = dissolvedIndices.has(segment.order);
              
              return (
                <motion.span
                  key={segment.order}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isDissolved ? 1 : 0,
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{
                    color: segment.highlight ? '#A78BFA' : '#E2E8F0',
                    fontWeight: segment.highlight ? 400 : 300,
                  }}
                >
                  {segment.text}
                </motion.span>
              );
            })}
            
            {/* Final phrase - appears after several dissolves */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{
                opacity: dissolvedIndices.size >= 6 ? 1 : 0,
              }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                color: '#A78BFA',
                fontWeight: 400,
              }}
            >
              —something <span style={{ color: '#E2E8F0', fontWeight: 300 }}>lived</span>, not predicted.
            </motion.span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="h-20 flex items-center justify-center mt-16">
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              <CelestialButton
                onClick={onNext}
                variant="primary"
                size="lg"
              >
                Begin
              </CelestialButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}