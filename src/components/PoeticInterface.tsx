import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, EyeOff, Download, Layers, Home, Globe2, Zap } from 'lucide-react';
import { Button } from './ui/button';

// Type definitions
interface Planet {
  name: string;
  glyph: string;
  archetype_name: string;
  archetype_figure_name: string;
  essence: string;
  why: string;
  fluid_qualities: string[];
  visual_elements: string[];
}

interface Sign {
  name: string;
  archetype_name: string;
  glyph: string;
  element: string;
  visual_mappings: {
    shape: string;
    motion: string;
    texture: string;
    palette: string;
    rhythm: string;
  };
  expressions: string[];
  visual_elements: string[];
}

interface House {
  house: number;
  name: string;
  color: string;
  essence: string;
  keywords: string[];
  visual_elements: string[];
}

interface Dataset {
  planets: Planet[];
  signs: Sign[];
  houses: House[];
}

interface ParsedVariable {
  fullPath: string;
  displayText: string;
  hoverData: {
    title: string;
    summary: string;
    details?: string;
  };
  color: string;
}

type ViewType = 'spiral_overview' | 'house_focus' | 'planet_focus' | 'flat_spiral_aspects';

// Spiral Overview Templates
const SPIRAL_OVERVIEW_TEMPLATES = [
  "{{final_name}}—a chart shaped by {{dominant_motif}}, held by {{centers}}, where hard/soft lean {{hard_soft_ratio}} and the elements breathe {{element_balance}}.",
  "Between {{top_aspect.a_planet}} and {{top_aspect.b_planet}}, a {{top_aspect.aspect}} speaks {{top_aspect.strength}}; the web traces your {{signature_axis}}.",
  "Motion gathers around {{centers}} while the field opens to {{element_balance}}; the pattern prefers relation over certainty."
];

// Tooltips for spiral overview variables
const SPIRAL_OVERVIEW_TOOLTIPS: Record<string, string> = {
  'final_name': 'Your synthesized archetype name (from motifs, centers, and balances).',
  'dominant_motif': 'Prevailing pattern formed by your strongest aspect types.',
  'centers': 'Planets acting as hubs by strength/centrality.',
  'hard_soft_ratio': 'Hard (conj/square/opp) vs. soft (trine/sextile) emphasis.',
  'element_balance': 'Relative weight of Fire/Earth/Air/Water across placements.',
  'signature_axis': 'Primary axis or house bridge emphasized by aspects.',
  'top_aspect.a_planet': 'First planet in the strongest aspect.',
  'top_aspect.b_planet': 'Second planet in the strongest aspect.',
  'top_aspect.aspect': 'Highest-strength aspect driving this chart\'s tone.',
  'top_aspect.strength': 'Intensity of this aspect\'s influence.',
};

// Aspect noun mappings
const ASPECT_NOUNS: Record<string, string> = {
  'Conjunction': 'convergence',
  'Sextile': 'doorway',
  'Square': 'engine of friction',
  'Trine': 'current',
  'Opposition': 'bridge',
};

export default function PoeticInterface() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentView, setCurrentView] = useState<ViewType>('spiral_overview');
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [parsedVariables, setParsedVariables] = useState<Map<string, ParsedVariable>>(new Map());
  const [hoveredVariable, setHoveredVariable] = useState<string | null>(null);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [currentTokens, setCurrentTokens] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load JSON file
  useEffect(() => {
    const loadData = async () => {
      try {
        const datasetResponse = await fetch('/newest_integrated_dataset.json');
        if (!datasetResponse.ok) {
          throw new Error('Failed to load dataset');
        }
        const datasetJson = await datasetResponse.json();
        setDataset(datasetJson.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Generate mock chart data for spiral overview
  const generateSpiralOverviewTokens = (dataset: Dataset) => {
    const aspects = ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'];
    const motifs = ['Flowing harmony', 'Creative tension', 'Dynamic balance', 'Steady grounding', 'Spiraling evolution'];
    const signatureAxes = ['self-other axis', 'material-transcendent bridge', 'mind-body continuum', 'inner-outer dance'];
    const finalNames = ['The Weaver of Paradox', 'The Alchemical Bridge', 'The Spiral Dancer', 'The Harmonic Lens', 'The Pattern Keeper'];

    // Calculate element balance (simplified - normally from actual planet placements)
    const elementBalance = {
      fire: Math.floor(Math.random() * 5) + 1,
      earth: Math.floor(Math.random() * 5) + 1,
      air: Math.floor(Math.random() * 5) + 1,
      water: Math.floor(Math.random() * 5) + 1,
    };

    // Calculate hard/soft ratio (simplified)
    const hardCount = Math.floor(Math.random() * 8) + 2;
    const softCount = Math.floor(Math.random() * 8) + 2;
    const total = hardCount + softCount;
    const hardRatio = hardCount / total;
    const softRatio = softCount / total;

    // Select center planets (2-3 planets that are most aspected)
    const centerPlanets = dataset.planets
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 2)
      .map(p => p.name);

    // Generate top aspect
    const planet1 = dataset.planets[Math.floor(Math.random() * dataset.planets.length)];
    const planet2 = dataset.planets.filter(p => p.name !== planet1.name)[Math.floor(Math.random() * 9)];
    const aspectType = aspects[Math.floor(Math.random() * aspects.length)];
    const strength = Math.random();

    return {
      final_name: finalNames[Math.floor(Math.random() * finalNames.length)],
      dominant_motif: motifs[Math.floor(Math.random() * motifs.length)],
      centers: centerPlanets,
      hard_soft_ratio: { hard: hardRatio, soft: softRatio },
      element_balance: elementBalance,
      top_aspect: {
        a_planet: planet1.name,
        b_planet: planet2.name,
        aspect: aspectType,
        strength: strength,
      },
      signature_axis: signatureAxes[Math.floor(Math.random() * signatureAxes.length)],
    };
  };

  // Format helper functions
  const formatCenters = (centers: string[]) => {
    if (centers.length === 0) return '—';
    if (centers.length === 1) return centers[0];
    if (centers.length === 2) return `${centers[0]} and ${centers[1]}`;
    return `${centers.slice(0, -1).join(', ')}, and ${centers[centers.length - 1]}`;
  };

  const formatHardSoftRatio = (ratio: { hard: number; soft: number }) => {
    const hardPercent = Math.round(ratio.hard * 100);
    const softPercent = Math.round(ratio.soft * 100);
    if (hardPercent > 65) return 'toward friction and challenge';
    if (softPercent > 65) return 'toward flow and ease';
    return `balanced (${hardPercent}% hard, ${softPercent}% soft)`;
  };

  const formatElementBalance = (balance: { fire: number; earth: number; air: number; water: number }) => {
    const total = balance.fire + balance.earth + balance.air + balance.water;
    const entries = Object.entries(balance)
      .sort(([, a], [, b]) => b - a);
    
    const primary = entries[0];
    const secondary = entries[1];
    
    return `mostly ${primary[0]} (${Math.round((primary[1] / total) * 100)}%), with ${secondary[0]} undertones`;
  };

  const formatIntensityAdverb = (strength: number) => {
    if (strength >= 0.85) return 'undeniably';
    if (strength >= 0.60) return 'clearly';
    if (strength >= 0.35) return 'subtly';
    return 'in whispers';
  };

  const formatAspectNoun = (aspect: string) => {
    return ASPECT_NOUNS[aspect] || aspect.toLowerCase();
  };

  // Generate a new sentence for the current view
  const generateSentence = () => {
    if (!dataset) return;
    
    setIsGenerating(true);

    if (currentView === 'spiral_overview') {
      // Generate tokens for spiral overview
      const tokens = generateSpiralOverviewTokens(dataset);
      setCurrentTokens(tokens);

      // Select a random template
      const template = SPIRAL_OVERVIEW_TEMPLATES[Math.floor(Math.random() * SPIRAL_OVERVIEW_TEMPLATES.length)];
      
      // Replace variables in template
      let sentence = template;
      const variableMap = new Map<string, ParsedVariable>();

      // Process each token
      const processToken = (path: string, value: string, tooltip: string, color: string = '#9B5DE5') => {
        const placeholder = `{{${path}}}`;
        if (sentence.includes(placeholder)) {
          variableMap.set(placeholder, {
            fullPath: path,
            displayText: value,
            hoverData: {
              title: path.split('.').pop()?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || path,
              summary: tooltip,
            },
            color,
          });
          sentence = sentence.replace(placeholder, `<span data-var="${placeholder}">${value}</span>`);
        }
      };

      // Process all tokens
      processToken('final_name', tokens.final_name, SPIRAL_OVERVIEW_TOOLTIPS['final_name'], '#F9C74F');
      processToken('dominant_motif', tokens.dominant_motif, SPIRAL_OVERVIEW_TOOLTIPS['dominant_motif'], '#9B5DE5');
      processToken('centers', formatCenters(tokens.centers), SPIRAL_OVERVIEW_TOOLTIPS['centers'], '#90DBF4');
      processToken('hard_soft_ratio', formatHardSoftRatio(tokens.hard_soft_ratio), SPIRAL_OVERVIEW_TOOLTIPS['hard_soft_ratio'], '#F94144');
      processToken('element_balance', formatElementBalance(tokens.element_balance), SPIRAL_OVERVIEW_TOOLTIPS['element_balance'], '#7B904B');
      processToken('signature_axis', tokens.signature_axis, SPIRAL_OVERVIEW_TOOLTIPS['signature_axis'], '#577590');
      
      // Top aspect tokens
      processToken('top_aspect.a_planet', tokens.top_aspect.a_planet, SPIRAL_OVERVIEW_TOOLTIPS['top_aspect.a_planet'], '#F8961E');
      processToken('top_aspect.b_planet', tokens.top_aspect.b_planet, SPIRAL_OVERVIEW_TOOLTIPS['top_aspect.b_planet'], '#F8961E');
      processToken('top_aspect.aspect', formatAspectNoun(tokens.top_aspect.aspect), SPIRAL_OVERVIEW_TOOLTIPS['top_aspect.aspect'], '#F3722C');
      processToken('top_aspect.strength', formatIntensityAdverb(tokens.top_aspect.strength), SPIRAL_OVERVIEW_TOOLTIPS['top_aspect.strength'], '#F94144');

      setCurrentSentence(sentence);
      setParsedVariables(variableMap);
    }
    
    setTimeout(() => setIsGenerating(false), 300);
  };

  // Export as text
  const exportAsText = async () => {
    const element = document.getElementById('poetic-sentence-container');
    if (!element) return;

    try {
      const textContent = element.innerText;
      const blob = new Blob([`${getViewTitle()}\n\n${textContent}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = 'fluid-astrology-poem.txt';
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting poem:', error);
    }
  };

  // Generate initial sentence on mount
  useEffect(() => {
    if (!loading && !error && dataset) {
      generateSentence();
    }
  }, [loading, error, dataset, currentView]);

  // Get view title
  const getViewTitle = () => {
    const titles: Record<ViewType, string> = {
      'spiral_overview': 'Constellation of Becoming',
      'house_focus': 'House Focus',
      'planet_focus': 'Planet Focus',
      'flat_spiral_aspects': 'Aspect Web',
    };
    return titles[currentView];
  };

  // Parse sentence HTML to extract variables
  const renderSentence = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const spanRegex = /<span data-var="([^"]+)">([^<]+)<\/span>/g;
    let match;

    while ((match = spanRegex.exec(currentSentence)) !== null) {
      const [fullMatch, varKey, text] = match;
      const startIndex = match.index;

      // Add text before the variable
      if (startIndex > lastIndex) {
        parts.push(currentSentence.substring(lastIndex, startIndex));
      }

      // Add the variable as an interactive element
      const varData = parsedVariables.get(varKey);
      if (varData) {
        parts.push(
          <InteractiveVariable
            key={`${varKey}-${startIndex}`}
            varKey={varKey}
            varData={varData}
            isHovered={hoveredVariable === varKey}
            onHover={(key) => setHoveredVariable(key)}
            onLeave={() => setHoveredVariable(null)}
          />
        );
      }

      lastIndex = startIndex + fullMatch.length;
    }

    // Add remaining text
    if (lastIndex < currentSentence.length) {
      parts.push(currentSentence.substring(lastIndex));
    }

    return parts;
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-white/60">Loading cosmic data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden relative">
      {/* Ambient background animation */}
      <CosmicBackground />

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
        {/* View tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => setCurrentView('spiral_overview')}
            variant={currentView === 'spiral_overview' ? 'default' : 'outline'}
            className="rounded-full"
          >
            <Globe2 className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            onClick={() => setCurrentView('house_focus')}
            variant={currentView === 'house_focus' ? 'default' : 'outline'}
            className="rounded-full"
            disabled
          >
            <Home className="mr-2 h-4 w-4" />
            House
          </Button>
          <Button
            onClick={() => setCurrentView('planet_focus')}
            variant={currentView === 'planet_focus' ? 'default' : 'outline'}
            className="rounded-full"
            disabled
          >
            <Layers className="mr-2 h-4 w-4" />
            Planet
          </Button>
          <Button
            onClick={() => setCurrentView('flat_spiral_aspects')}
            variant={currentView === 'flat_spiral_aspects' ? 'default' : 'outline'}
            className="rounded-full"
            disabled
          >
            <Zap className="mr-2 h-4 w-4" />
            Aspects
          </Button>
        </div>

        {/* Title */}
        <motion.h1
          key={currentView}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/90 mb-8 text-center"
        >
          {getViewTitle()}
        </motion.h1>

        {/* Sentence container */}
        <div 
          id="poetic-sentence-container"
          className="max-w-4xl w-full bg-slate-950/40 backdrop-blur-md rounded-2xl p-12 border border-white/10 shadow-2xl mb-8 min-h-[200px] flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSentence}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-white/95 text-center leading-relaxed"
            >
              {renderSentence()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center">
          <Button
            onClick={generateSentence}
            disabled={isGenerating}
            className="bg-purple-600/90 hover:bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Sentence
          </Button>

          <Button
            onClick={() => setIsContextOpen(!isContextOpen)}
            variant="outline"
            className="border-white/20 text-white/80 hover:bg-white/10 px-6 py-3 rounded-full"
          >
            {isContextOpen ? <EyeOff className="mr-2 h-5 w-5" /> : <Eye className="mr-2 h-5 w-5" />}
            View Tokens
          </Button>

          <Button
            onClick={exportAsText}
            variant="outline"
            className="border-white/20 text-white/80 hover:bg-white/10 px-4 py-3 rounded-full"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Token sidebar */}
      <AnimatePresence>
        {isContextOpen && currentTokens && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-slate-950/90 backdrop-blur-xl border-l border-white/10 p-8 overflow-y-auto z-50"
          >
            <h2 className="text-white/90 mb-6">🔮 Chart Tokens</h2>
            
            {currentView === 'spiral_overview' && (
              <div className="space-y-4">
                <TokenDisplay label="Final Name" value={currentTokens.final_name} color="#F9C74F" />
                <TokenDisplay label="Dominant Motif" value={currentTokens.dominant_motif} color="#9B5DE5" />
                <TokenDisplay label="Centers" value={formatCenters(currentTokens.centers)} color="#90DBF4" />
                <TokenDisplay 
                  label="Hard/Soft Ratio" 
                  value={`${Math.round(currentTokens.hard_soft_ratio.hard * 100)}% / ${Math.round(currentTokens.hard_soft_ratio.soft * 100)}%`}
                  color="#F94144" 
                />
                <TokenDisplay 
                  label="Element Balance" 
                  value={Object.entries(currentTokens.element_balance).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  color="#7B904B" 
                />
                <TokenDisplay 
                  label="Top Aspect" 
                  value={`${currentTokens.top_aspect.a_planet} ${currentTokens.top_aspect.aspect} ${currentTokens.top_aspect.b_planet} (${Math.round(currentTokens.top_aspect.strength * 100)}%)`}
                  color="#F3722C" 
                />
                <TokenDisplay label="Signature Axis" value={currentTokens.signature_axis} color="#577590" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Interactive variable component
interface InteractiveVariableProps {
  varKey: string;
  varData: ParsedVariable;
  isHovered: boolean;
  onHover: (key: string) => void;
  onLeave: () => void;
}

function InteractiveVariable({ varKey, varData, isHovered, onHover, onLeave }: InteractiveVariableProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDelay, setTooltipDelay] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    onHover(varKey);
    const timeout = setTimeout(() => setShowTooltip(true), 120);
    setTooltipDelay(timeout);
  };

  const handleMouseLeave = () => {
    onLeave();
    if (tooltipDelay) clearTimeout(tooltipDelay);
    setShowTooltip(false);
  };

  return (
    <span className="relative inline-block">
      <motion.span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          textShadow: isHovered
            ? `0 0 20px ${varData.color}, 0 0 40px ${varData.color}80`
            : '0 0 0px transparent',
          color: isHovered ? varData.color : 'inherit',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="cursor-pointer underline decoration-dotted underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all"
        style={{ color: varData.color }}
      >
        {varData.displayText}
      </motion.span>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.9, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 pointer-events-none z-50"
          >
            <div
              className="p-4 rounded-lg backdrop-blur-xl border shadow-2xl"
              style={{
                backgroundColor: 'rgba(6, 6, 12, 0.88)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
              }}
            >
              <div className="text-white/60 text-xs mb-1">{varData.hoverData.title}</div>
              <div className="text-white/95 text-sm mb-2">{varData.hoverData.summary}</div>
              {varData.hoverData.details && (
                <div className="text-white/50 text-xs">{varData.hoverData.details}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// Token display component
interface TokenDisplayProps {
  label: string;
  value: string;
  color: string;
}

function TokenDisplay({ label, value, color }: TokenDisplayProps) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="text-white/50 text-xs mb-1">{label}</div>
      <div className="text-white/95 text-sm" style={{ color }}>{value}</div>
    </div>
  );
}

// Cosmic background animation
function CosmicBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({  // Reduced from 80 to 40
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)
          `,
        }}
      />

      {/* Animated particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}