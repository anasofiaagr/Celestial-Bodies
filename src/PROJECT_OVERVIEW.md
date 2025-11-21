# 🌌 Celestial Bodies - Project Overview

An interactive 3D astrological visualization platform built with React, Three.js (React Three Fiber), and Motion, featuring a 12-layer helical spiral structure with dynamic poetic interpretation generation.

---

## 🎯 Core Philosophy

**Anti-essentialist, relational astrology as metaphor**
- Treats astrology as pattern, language, and atmosphere — not prediction
- Non-deterministic, reflective interpretation
- Avoids traditional clichés
- Emphasizes fluidity and personal interpretation

---

## 🎨 Visual Design System

### Typography (Four-Tier)
- **✨ Poetic Display**: Crimson Pro (serif, elegant) - Onboarding phrases
- **🌙 Headings**: Sora (holistic, spiritual) - Section titles
- **📖 Body**: Manrope (warm, readable) - Poetic content
- **🎮 UI**: Pixelify Sans (pixelated, futuristic) - Buttons, labels

### Color Palette
- Soft cinematic gradients (purple/indigo/pink)
- 12 unique house colors for layers
- Dynamic variable colors in text
- Subtle motion and slow transitions

### Animation Approach
- Slow, subtle, contemplative motion
- GPU-accelerated transforms
- Smooth camera transitions between views
- Floating elements with gentle drift

---

## 🌀 Four View Modes

### 1. **Spiral Overview** (Default)
- 12-layer helical spiral (one per house)
- 10 orbital planets per layer (120 total nodes)
- Continuous spiral lines connecting layers
- 3D zodiac signs at layer centers
- **Poetic Output**: One holistic sentence on the right side
- **Cue Stars**: 4 educational floating stars

### 2. **House Layer View**
- Focus on single house/layer
- Shows only that layer's planets
- Zodiac sign enlarged and centered
- Fusion label below zodiac figure
- **Poetic Output**: One contextual sentence at top center
- **Cue Stars**: 3 educational floating stars

### 3. **Planet View**
- Deep focus on individual planet
- Shows planet's sign, house, aspects
- Left-column poetic overlay
- **Poetic Output**: 1-3 intimate sentences in left column
- **Cue Stars**: 2 educational floating stars

### 4. **Constellation View**
- Aspect-focused visualization
- Floating poetic phrases in 3D space
- Constellation lines between planets
- **Poetic Output**: Floating aspect phrases within visualization
- **Cue Stars**: 2 educational floating stars

---

## 🎭 Interactive Systems

### Sentence Generation Engine
**Location**: `/utils/SentenceEngine.ts`
- Template-based poetic sentence generation
- Four contexts: spiral, house, planet, constellation
- Variable resolution from integrated dataset
- Dynamic color-coding and hover tooltips
- Supports primary sentences and cue sentences

### Explanatory Cue Stars ⭐ NEW
**Location**: `/components/CueStar.tsx`, `/components/CueStarContainer.tsx`
- Floating star icons that expand into explanatory text on hover
- Fixed educational content (not variable-driven)
- Appears in all four view modes
- Helps non-astrology users understand concepts
- Smooth expand/collapse animations
- See `/CUE_STAR_SYSTEM.md` for full documentation

### Hover Tooltips
**Location**: `/components/SentenceBlock.tsx`
- React Portal-based tooltips
- Show metadata for variable tokens
- Title + summary + fallback info
- Dynamic positioning to avoid overflow

### Navigation
- Click layers to enter House View
- Click planets to enter Planet View
- Click aspects to focus aspect
- ESC key to exit focused views
- Arrow navigation between house layers

---

## 📊 Data Architecture

### Input Data
1. **User Birth Data** (via onboarding)
   - Date, time, location
   - Geocoded via Nominatim API
   - Chart generated via Astrologer API (RapidAPI)

2. **Integrated Dataset** 
   - `/data/newest_integrated_dataset.json`
   - Houses, signs, planets, aspects
   - Symbolic metadata for interpretation

3. **Sentence Templates**
   - `/utils/spiralTemplates.ts`
   - `/utils/houseTemplates.ts`
   - `/utils/planetTemplates.ts`
   - `/utils/constellationTemplates.ts`

### Enrichment Pipeline
**Location**: `/utils/ChartEnricher.ts`
- Merges API data with symbolic dataset
- Creates enriched chart object
- Used by sentence engine for generation

---

## 🎯 User Journey

1. **Onboarding** (3 screens)
   - Poetic introduction with word-by-word animation
   - Birth data collection (date/time/location)
   - Uses Crimson Pro display font for emotional impact

2. **Spiral Overview**
   - Default view showing full chart spiral
   - Cue stars explain concepts
   - Holistic sentence on right side

3. **Exploration**
   - User clicks layers/planets/aspects
   - Views transition smoothly
   - Contextual sentences and cue stars guide understanding

4. **Interpretation**
   - Optional interpretation panel (traditional format)
   - Compare poetic vs traditional astrology
   - Export/save options

---

## 🛠️ Technical Stack

### Core
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool

### 3D Visualization
- **React Three Fiber** - Three.js React renderer
- **@react-three/drei** - Helper components
- **Three.js** - 3D graphics library

### Animation
- **Motion (Framer Motion)** - React animations
- **React Spring** - Physics-based animations (aspects)

### State Management
- **React Context** - Chart data context
- **React Hooks** - Local state

### APIs
- **Astrologer API** (RapidAPI) - Chart calculation
- **Nominatim API** (OpenStreetMap) - Geocoding

### Styling
- **Tailwind CSS v4** - Utility-first styling
- **Custom tokens** - In `/styles/globals.css`

---

## 📁 Project Structure

```
/
├── components/
│   ├── Spiral.tsx                    # Main 3D spiral visualization
│   ├── SpiralVisualization.tsx       # Orchestrator component
│   ├── Onboarding.tsx                # 3-screen onboarding
│   ├── FloatingPoeticSentence.tsx    # Spiral/House sentences
│   ├── PlanetPoeticOverlay.tsx       # Planet view sentences
│   ├── ConstellationView.tsx         # Constellation mode
│   ├── CueStar.tsx                   # ⭐ Educational cue component
│   ├── CueStarContainer.tsx          # ⭐ Cue management per view
│   ├── SentenceBlock.tsx             # Variable token renderer
│   ├── VariableTooltip.tsx           # Hover tooltip for variables
│   ├── UIOverlay.tsx                 # Bottom controls
│   ├── ZodiacBackground.tsx          # 3D zodiac signs
│   └── ui/                           # shadcn components
├── utils/
│   ├── SentenceEngine.ts             # Core generation engine
│   ├── spiralTemplates.ts            # Spiral view templates
│   ├── houseTemplates.ts             # House view templates (13 templates)
│   ├── planetTemplates.ts            # Planet view templates
│   ├── constellationTemplates.ts     # Constellation templates
│   ├── ChartEnricher.ts              # Data enrichment
│   ├── hoverSchemaData.ts            # Tooltip metadata
│   └── planetDistribution.ts         # Planet positioning
├── data/
│   └── newest_integrated_dataset.json # Symbolic astrology data
├── contexts/
│   └── ChartContext.tsx              # Global chart state
├── styles/
│   └── globals.css                   # Tailwind config + tokens
├── FONT_OPTIONS.md                   # Typography system docs
├── CUE_STAR_SYSTEM.md                # ⭐ Cue star documentation
└── PROJECT_OVERVIEW.md               # This file
```

---

## 🎨 Design Patterns

### Component Architecture
- **Orchestrator pattern**: `SpiralVisualization` coordinates all views
- **Render props**: Pass callbacks for view transitions
- **Context for global state**: Chart data via React Context
- **Local state for UI**: View modes, focus states

### Animation Patterns
- **Declarative animations**: Motion for UI elements
- **Imperative camera**: Direct Three.js camera control for 3D
- **Staggered reveals**: Sequential delays for polish
- **Exit animations**: AnimatePresence for smooth transitions

### Data Flow
```
User Input → API → Enrichment → Templates → Sentence Engine → Rendered Tokens
                                          ↓
                                    Hover Tooltips
```

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Save/export chart functionality
- [ ] Multiple chart comparison
- [ ] Time transit animations
- [ ] Social sharing with unique URLs
- [ ] Audio/sound design layer
- [ ] Mobile-optimized touch controls
- [ ] Accessibility improvements (keyboard nav, screen readers)

### Cue Star Enhancements
- [ ] Onboarding tour highlighting each cue
- [ ] Dismiss forever functionality
- [ ] Usage analytics
- [ ] Localization support

### Sentence Engine Enhancements
- [ ] More template variations (currently ~30-40 per view)
- [ ] User-contributed templates
- [ ] Dynamic template weighting based on usage
- [ ] Sentence bookmarking/favoriting

---

## 📚 Key Documentation Files

- **`/FONT_OPTIONS.md`** - Typography system and alternatives
- **`/CUE_STAR_SYSTEM.md`** - ⭐ NEW: Educational cue system
- **`/PROJECT_OVERVIEW.md`** - This file: comprehensive overview
- **Component READMEs** - Inline JSDoc comments in each component

---

## 🎓 Learning Resources

### For Developers
- React Three Fiber: [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
- Motion API: [motion.dev](https://motion.dev)
- Tailwind v4: [tailwindcss.com](https://tailwindcss.com)

### For Astrology Concepts
- House system: Represents life areas (12 fields)
- Sign system: Represents styles/archetypes (12 qualities)
- Planet system: Represents drives/verbs (10 actors)
- Aspect system: Represents relationships/angles between planets

---

*Celestial Bodies aims to make astrology accessible as a tool for self-reflection and pattern recognition, moving beyond fortune-telling into the realm of poetic metaphor and personal exploration.* ✨

Last Updated: November 2024
