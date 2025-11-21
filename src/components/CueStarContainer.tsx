import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CueStar } from './CueStar';
import { HelpCircle, Sparkles } from 'lucide-react';

export type ViewMode = 'spiral' | 'house' | 'planet' | 'constellation' | 'evolving';

interface CueStarContainerProps {
  viewMode: ViewMode;
}

// Explanatory cues for each view
const CUE_CONTENT = {
  // SPIRAL OVERVIEW - 4 cues
  spiral: [
    {
      title: "What the Spiral Is",
      text: "Your chart is a moving ecology: planets, signs, and houses weave together in one continuous motion. This spiral renders that motion visually.",
    },
    {
      title: "Why Triads Matter",
      text: "Each point you see is a three-part sentence: a planet, filtered through a sign, finding expression in a house.",
    },
    {
      title: "How to Navigate",
      text: "Hover, click, or zoom into layers to unpack how the chart behaves. Nothing here is fixed — it is a snapshot of tendencies, not destiny.",
    },
    {
      title: "The Philosophy",
      text: "This project treats astrology as metaphor, pattern, and language — not prediction. You're reading atmospheres, not verdicts.",
    }
  ],
  // HOUSE LAYER VIEW - 3 cues
  house: [
    {
      title: "What a House Means",
      text: "Each house is a life-field: a space where certain kinds of experiences gather. It's not a building but a terrain.",
    },
    {
      title: "Why a Planet in a House Matters",
      text: "Planets bring motion and motive. When they enter a house, they animate that field with their own temperament.",
    },
    {
      title: "The Sign Layer",
      text: "The sign in the center dyes the whole layer. It sets the tone for how this part of your life expresses itself.",
    }
  ],
  // PLANET VIEW - 2 cues
  planet: [
    {
      title: "Planet Logic",
      text: "A planet is not an object but a verb — a way of doing something: loving, expressing, acting, transforming.",
    },
    {
      title: "Why Sign + House Influence It",
      text: "The sign gives the planet a style of movement. The house gives it a stage of expression. Together they create a behavior.",
    }
  ],
  // CONSTELLATION VIEW - 2 cues
  constellation: [
    {
      title: "What Aspects Are",
      text: "Aspects are angles — the distances between planets. These lines show tensions, harmonies, frictions, and invitations.",
    },
    {
      title: "Why It Forms a Constellation",
      text: "The shape you see is unique to your chart: a map of relationships between energies, drawn as if it were a night sky.",
    }
  ],
  // EVOLVING VIEW - 3 cues
  evolving: [
    {
      title: "What This Layer Is",
      text: "Evolving View is a living layer of your chart. It doesn't predict who you are; it keeps reshaping how your placements can feel today.",
    },
    {
      title: "Why Seeds Change",
      text: "Each seed represents a planet-sign-house triad. Hover to see the full poem. Click \"Try another\" to see how the same placement can speak differently.",
    },
    {
      title: "The Anti-Essentialist Stance",
      text: "These aren't fixed truths about who you are. They're provisional, relational ways of reading the same natal data — atmosphere, not verdict.",
    }
  ]
};

// Calculate radial positions for cues emanating from bottom-right
function getRadialPosition(index: number, total: number) {
  // Arc from bottom to left (180° to 270° range)
  const startAngle = 180; // degrees
  const endAngle = 270;
  const angleRange = endAngle - startAngle;
  const angle = startAngle + (angleRange / (total - 1)) * index;
  const angleRad = (angle * Math.PI) / 180;
  
  // Distance from toggle button
  const radius = 140; // pixels
  
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;
  
  return { x, y };
}

export function CueStarContainer({ viewMode }: CueStarContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cues = CUE_CONTENT[viewMode] || [];

  return (
    <>
      {/* Toggle Button - Fixed Bottom Right */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-md rounded-full border border-cyan-400/30 shadow-lg cursor-pointer hover:border-cyan-400/60 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing outer glow */}
          <motion.div 
            className="absolute inset-0 blur-xl bg-cyan-400/30 rounded-full"
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
          
          {/* Icon */}
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-cyan-300 text-xl">×</div>
              </motion.div>
            ) : (
              <motion.div
                key="help"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-6 h-6 text-cyan-300" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Counter badge */}
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-[10px] flex items-center justify-center text-white border border-cyan-300/60"
            animate={{
              scale: isExpanded ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: 0.3
            }}
          >
            {cues.length}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Cue Stars - Radiate out when expanded */}
      <AnimatePresence>
        {isExpanded && cues.map((cue, index) => {
          const { x, y } = getRadialPosition(index, cues.length);
          
          return (
            <CueStar
              key={`${viewMode}-cue-${index}`}
              title={cue.title}
              text={cue.text}
              position={{ x, y }}
              delay={0.1 + index * 0.05}
            />
          );
        })}
      </AnimatePresence>
    </>
  );
}