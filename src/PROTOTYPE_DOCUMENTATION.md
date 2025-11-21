# 🌌 Celestial Bodies - Prototype Documentation
## Interactive 3D Astrological Visualization System

---

## 📋 Project Overview

**Celestial Bodies** is an advanced 3D interactive astrological visualization built with React, React Three Fiber, and Framer Motion. It features a 12-layer helical spiral structure with 10 orbital planet nodes, complete aspect calculation, and personalized interpretation through integrated JSON datasets.

---

## 🎯 Core Features

### 1. **Four View Modes**
- **Spiral View** - Holistic overview with one poetic sentence (right side)
- **House Layer View** - Contextual sentence per house (top center)
- **Planet View** - 1-3 intimate sentences (left column)
- **Constellation View** - Aspects-only with floating poetic phrases in 3D space

### 2. **Visual Components**
- 12-layer helical spiral structure
- 10 orbital planet nodes
- Zodiac backgrounds as 3D spherical skyboxes
- Hover dimming effects
- Dynamic aspect lines with colors
- Parallax star fields
- Shimmer/glow effects

### 3. **Interactive Systems**
- Click-to-focus on houses, planets, and aspects
- Hover tooltips with astrological data
- Slide-out interpretation panels
- View mode toggles (Funnel/Flat view)
- Zoom and rotation controls

---

## 🎨 Recent Changes & Improvements

### ✅ Phase 1: Tooltip System Overhaul
**Problem:** Tooltips were rendering behind the Canvas and positioning incorrectly

**Solution:**
- ✨ Implemented React Portal rendering (`createPortal()` to `document.body`)
- ✨ Fixed positioning to appear 10px above hovered elements
- ✨ Z-index set to 99999 for maximum visibility
- ✨ Changed from `e.target` to `e.currentTarget` for accurate positioning

**Files Modified:**
- `/components/SentenceBlock.tsx` - Added Portal implementation
- `/components/FloatingPoeticSentence.tsx` - Enhanced logging

**Result:** Tooltips now appear above all elements with perfect positioning

---

### ✅ Phase 2: Dynamic Variable Color System
**Problem:** All variables had the same purple color, making them hard to distinguish

**Solution:** Implemented color-coded variable system based on astrological type

**Color Palette:**

#### 🪐 Planets (Vibrant)
- Sun: `#FDB813` (Gold)
- Moon: `#C0C0D8` (Silver)
- Mercury: `#87CEEB` (Sky Blue)
- Venus: `#FFB6C1` (Pink)
- Mars: `#FF4444` (Red)
- Jupiter: `#FF8C00` (Orange)
- Saturn: `#8B7355` (Brown)
- Uranus: `#00CED1` (Cyan)
- Neptune: `#9370DB` (Purple)
- Pluto: `#8B0000` (Dark Red)

#### ♈ Signs (Zodiac Themed)
- Aries: `#FF6B6B`
- Taurus: `#66BB6A`
- Gemini: `#FFA726`
- Cancer: `#C0C0D8`
- Leo: `#FFD700`
- Virgo: `#8BC34A`
- Libra: `#FFB6C1`
- Scorpio: `#8B0000`
- Sagittarius: `#9C27B0`
- Capricorn: `#795548`
- Aquarius: `#00BCD4`
- Pisces: `#7B68EE`

#### 🏠 Other Elements
- Houses: `#60A5FA` (Blue)
- Aspect Types: `#F59E0B` (Amber)
- Aspect Keywords: `#EC4899` (Pink)
- Aspect Colors: Uses actual aspect line color
- Elements: Fire=#FF6B6B, Earth=#66BB6A, Air=#87CEEB, Water=#9370DB
- Modes: `#F59E0B` (Amber)

**Files Modified:**
- `/utils/SentenceEngine.ts` - Added `getVariableColor()` function
- `/components/SentenceBlock.tsx` - Applied dynamic colors with text shadows

**Result:** Variables now glow with appropriate colors based on their astrological meaning

---

### ✅ Phase 3: Constellation View Variable Resolution
**Problem:** Constellation view was showing "—" instead of planet names

**Solution:**
- ✨ Enhanced `resolveVariable()` to handle nested paths like `aspect.from.planet.name`
- ✨ Added logic to handle schema/payload path mismatches
- ✨ Improved hover data for aspect planets (`aspect.from.planet`, `aspect.to.planet`)
- ✨ Changed `aspect.color` display from hex (#FFD700) to "this color" with actual color styling

**Files Modified:**
- `/utils/SentenceEngine.ts` - Enhanced path resolution logic
- `/utils/hoverSchemaData.ts` - Schema definitions for aspect variables

**Result:** Constellation sentences now display correct planet names and aspect data

---

### ✅ Phase 4: House Layer View Positioning
**Problem:** House layer sentences were overlapping with other UI elements

**Solution:**
- ✨ Repositioned to **top center** with `pt-16` padding
- ✨ Spiral view remains on **right side**
- ✨ Added view mode labels (purple for house, cyan for spiral)
- ✨ Wider container for house layer view (`max-w-3xl` vs `max-w-2xl`)

**Files Modified:**
- `/components/FloatingPoeticSentence.tsx` - Conditional positioning logic

**Result:** Clear visual hierarchy with no overlapping UI elements

---

## 🏗️ Architecture

### Component Hierarchy
```
App.tsx
└── SpiralVisualization.tsx (Main orchestrator)
    ├── Canvas (React Three Fiber)
    │   ├── Spiral3D.tsx (12-layer helical structure)
    │   ├── PlanetNodes.tsx (10 orbital planets)
    │   ├── AspectLines.tsx (Aspect connections)
    │   ├── ZodiacBackground3D.tsx (Skybox)
    │   └── ConstellationView.tsx (Aspects-only mode)
    │
    ├── UIOverlay.tsx (Top navigation)
    ├── FloatingPoeticSentence.tsx (Dynamic sentences)
    │   └── SentenceBlock.tsx (Token rendering + tooltips)
    │
    ├── PlanetPoeticOverlay.tsx (Planet focus mode)
    ├── ConstellationModeOverlay.tsx (Constellation mode)
    ├── InterpretationPanel.tsx (Slide-out panel)
    └── ParallaxStars.tsx (Background effects)
```

### Data Flow
```
1. User Input → SpiralVisualization state
2. State changes → Trigger useEffect in view components
3. View components → Call SentenceEngine.generateSentence()
4. SentenceEngine → Select template + resolve variables
5. Variables → Get data from payload + integrated dataset
6. Tokens → Rendered with colors, hover data, tooltips
7. User hovers → Tooltip portal renders to document.body
```

---

## 📦 Key Files & Responsibilities

### `/utils/SentenceEngine.ts`
**Purpose:** Core sentence generation system
**Key Functions:**
- `generateSentence()` - Creates tokenized sentences from templates
- `generateSentences()` - Creates multiple sentences (primary + cues)
- `resolveVariable()` - Extracts data from payload using schema paths
- `getHoverData()` - Generates tooltip content for variables
- `getVariableColor()` - Assigns colors based on variable type
- `parseTemplate()` - Converts template strings to token arrays

### `/utils/*Templates.ts`
**Files:**
- `spiralTemplates.ts` - Spiral overview sentences
- `houseTemplates.ts` - House layer sentences
- `planetTemplates.ts` - Planet focus sentences
- `constellationTemplates.ts` - Constellation aspect sentences

**Structure:**
```typescript
{
  id: "unique_template_id",
  context: "spiral_overview" | "house_focus" | "planet_focus" | "constellation_aspect",
  role: "primary" | "cue",
  weights: 1-4,
  text: "Template with {{variable.path}} placeholders",
  variables: ["variable.path", "another.variable"]
}
```

### `/utils/hoverSchemaData.ts`
**Purpose:** Defines how variables map to data and hover content
**Structure:**
```typescript
{
  "variable.path": {
    path: "data_source.field",
    hover: {
      title: "Display Title",
      summary_from: ["data.paths"],
      fallback: "Default text"
    }
  }
}
```

### `/data/newest_integrated_dataset.ts`
**Purpose:** Complete astrological reference data
**Contains:**
- Planet archetypes, essences, keywords
- Sign characteristics, visual mappings
- House meanings, keywords, visual elements
- Aspect library (types, colors, keywords, dynamics)

### `/components/SentenceBlock.tsx`
**Purpose:** Renders tokenized sentences with interactive tooltips
**Features:**
- Maps over token arrays
- Applies dynamic colors and text shadows
- Handles mouse events for tooltips
- Uses Portal for tooltip rendering
- Calculates tooltip positioning relative to viewport

### `/components/FloatingPoeticSentence.tsx`
**Purpose:** Generates and displays sentences for Spiral/House views
**Behavior:**
- Shows on right side for Spiral Overview
- Shows at top center for House Layer View
- Hidden when interpretation panel/planet/constellation modes active
- Generates sentences via SentenceEngine based on current view

---

## 🔧 Technical Implementation Details

### Tooltip Portal System
```typescript
// In SentenceBlock.tsx
{hoveredToken && (
  <>
    {createPortal(
      <div
        style={{
          position: 'fixed',
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          zIndex: 99999,
          // ... styling
        }}
      >
        {/* Tooltip content */}
      </div>,
      document.body
    )}
  </>
)}
```

**Why Portal?**
- Canvas has its own stacking context
- Regular DOM elements can't reliably appear above Canvas
- Portal renders to `document.body`, outside all stacking contexts
- Z-index 99999 ensures maximum priority

### Variable Resolution Logic
```typescript
// Nested path navigation
if (key.includes('.')) {
  const parts = key.split('.');
  value = payload.aspect;
  for (const part of parts) {
    if (part === 'planet_name' && value?.planet) {
      value = value.planet.name; // Handle schema mismatch
      break;
    } else {
      value = value?.[part];
    }
  }
}
```

**Why This Approach?**
- Schema uses snake_case: `aspect.from.planet_name`
- Payload uses camelCase objects: `aspect.from.planet.name`
- Logic bridges the gap between schema and actual data structure

### Color Assignment
```typescript
// Conditional color logic
if (variablePath.includes('planet')) {
  return planetColors[resolvedValue] || '#9B5DE5';
}
if (variablePath === 'aspect.color') {
  return payload.aspect?.color || '#9B5DE5';
}
```

**Strategy:**
- Check variable path for keywords
- Match resolved value to color map
- Use payload data directly for dynamic colors (aspect lines)
- Fallback to default purple

---

## 📊 Data Integration

### API Connections
1. **Astrologer API** (via RapidAPI)
   - Fetches natal chart data
   - Calculates planetary positions
   - Determines aspects and angles

2. **OpenStreetMap Nominatim API**
   - Automatic geocoding for birth locations
   - Converts place names to coordinates

### Local Dataset Integration
- `newest_integrated_dataset.ts` provides symbolic meanings
- Enriches API data with archetypes, keywords, visual mappings
- Powers the poetic sentence generation

---

## 🎭 View Mode Behaviors

### Spiral View (Default)
- **Display:** Full 12-layer spiral with all planets
- **Sentence:** One holistic overview (right side)
- **Interaction:** Click houses to enter House Layer View
- **Toggle:** Funnel/Flat view available

### House Layer View
- **Display:** Focused on single house layer (dimmed others)
- **Sentence:** Contextual house description (top center)
- **Interaction:** Click to return to Spiral View
- **Color:** Purple label

### Planet View
- **Display:** Planet-centered with dimmed surroundings
- **Sentences:** 1 primary + 2 cue sentences (left column)
- **Interaction:** Click planet node to activate
- **Features:** Planet archetype, essence, keywords

### Constellation View
- **Display:** Aspects-only (no spiral or houses)
- **Sentences:** Floating phrases near aspect lines
- **Interaction:** Click aspect lines for details
- **Features:** Aspect type, color, relationship dynamics

---

## 🐛 Known Issues & Future Enhancements

### Current Status
✅ All major systems functional
✅ Tooltips working across all views
✅ Variables resolving correctly
✅ Colors implemented

### Potential Enhancements
- [ ] Add animation when hovering variables (pulse spiral elements)
- [ ] Implement sentence history/navigation
- [ ] Add export feature for generated readings
- [ ] Create shareable chart links
- [ ] Add more template variations (20+ per context)
- [ ] Implement smooth transitions between view modes
- [ ] Add voice narration option
- [ ] Mobile-optimized touch controls
- [ ] Save favorite interpretations
- [ ] Compare two charts side-by-side

---

## 🎨 Design System

### Typography
- Primary font: System default (elegant serif feel)
- Sentence text: `text-2xl` to `text-4xl` depending on view
- Labels: `text-xs uppercase tracking-wider`

### Colors
- Background: Deep space black with star fields
- Accent: Purple `#9B5DE5` (default glow)
- UI Elements: Glass morphism with backdrop blur

### Animations
- **Entry:** Fade + slide from right/top (0.6s)
- **Exit:** Fade out (0.6s)
- **Hover:** Glow intensify (0.2s)
- **Transitions:** Smooth cubic-bezier easing

### Spacing
- Sentence containers: `p-12` to `p-16`
- Top spacing (house view): `pt-16`
- Max widths: `max-w-2xl` to `max-w-3xl`

---

## 🔄 State Management

### Key State Variables (SpiralVisualization.tsx)
```typescript
const [focusedHouse, setFocusedHouse] = useState<FocusedHouse | null>(null);
const [focusedPlanetIndex, setFocusedPlanetIndex] = useState<number | null>(null);
const [isPlanetFocusMode, setIsPlanetFocusMode] = useState(false);
const [isConstellationMode, setIsConstellationMode] = useState(false);
const [focusedAspect, setFocusedAspect] = useState<any>(null);
const [isInterpretationPanelOpen, setIsInterpretationPanelOpen] = useState(false);
const [chart, setChart] = useState<EnrichedChart | null>(null);
```

### Visibility Logic
```typescript
// FloatingPoeticSentence
isVisible={!isInterpretationPanelOpen && !isPlanetFocusMode && !isConstellationMode}

// PlanetPoeticOverlay
isActive={isPlanetFocusMode && focusedPlanetIndex !== null}

// ConstellationModeOverlay
isActive={isConstellationMode && focusedAspect}
```

---

## 📝 Template Examples

### Spiral Overview Template
```
"In this chart, {{chart.dominant_element}} energy dominates—{{chart.dominant_element_phrase}}—while {{chart.dominant_mode}} patterns keep initiating new cycles in {{chart.primary_cluster_house.essence}}."
```

### House Layer Template
```
"This layer, {{house.name}}, holds your life around {{house.essence}}, where experiences of {{house.keywords.0}} and {{house.keywords.1}} keep returning in new forms."
```

### Constellation Aspect Template
```
"{{aspect.from.planet.name}} and {{aspect.to.planet.name}} meet in a {{aspect.type}}—a {{aspects_library[aspect.type].relationship_type}} that keeps energy moving between them."
```

---

## 🚀 Performance Considerations

### Optimization Strategies
1. **Memoization:** Use `useMemo` for expensive calculations
2. **Lazy Loading:** Load 3D assets progressively
3. **Template Caching:** Templates loaded once at app start
4. **Selective Re-renders:** useEffect dependencies carefully managed
5. **Portal Optimization:** Single tooltip instance reused

### Bundle Size
- React Three Fiber: ~100KB
- Framer Motion: ~60KB
- Custom code: ~150KB
- Total: ~310KB (acceptable for rich 3D app)

---

## 🧪 Testing Checklist

### Visual Tests
- [ ] All view modes load correctly
- [ ] Sentences appear in correct positions
- [ ] Colors match specification
- [ ] Tooltips appear above Canvas
- [ ] Tooltips position correctly near variables

### Interaction Tests
- [ ] Click house → House Layer View
- [ ] Click planet → Planet View
- [ ] Click aspect → Constellation View detail
- [ ] Hover variable → Tooltip appears
- [ ] Move mouse → Tooltip follows (10px above)
- [ ] Toggle Funnel/Flat view

### Data Tests
- [ ] API returns valid chart data
- [ ] Variables resolve to correct values
- [ ] Hover data shows meaningful content
- [ ] All 12 houses generate sentences
- [ ] All 10 planets generate sentences
- [ ] All aspect types resolve correctly

---

## 📚 Resources & References

### Astrological Concepts
- **Houses:** 12 life areas (self, resources, communication, home, etc.)
- **Planets:** 10 archetypal energies (Sun, Moon, Mercury, Venus, Mars, etc.)
- **Signs:** 12 zodiac modalities (Aries through Pisces)
- **Aspects:** Angular relationships (conjunction, sextile, square, trine, opposition)
- **Elements:** Fire, Earth, Air, Water
- **Modes:** Cardinal (initiating), Fixed (sustaining), Mutable (adapting)

### Technical Documentation
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Framer Motion: https://www.framer.com/motion
- Astrology API: https://rapidapi.com/makingdatamatter/api/astrologer

---

## 💡 Tips for Miro Board Organization

### Suggested Board Structure
```
┌─────────────────────────────────────────┐
│  PROJECT OVERVIEW                       │
│  - Vision, goals, target users          │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  FEATURE MAP                            │
│  - 4 View Modes (sticky notes)          │
│  - Interactive Systems                  │
│  - Visual Components                    │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  TECHNICAL ARCHITECTURE                 │
│  - Component hierarchy diagram          │
│  - Data flow arrows                     │
│  - API integration points               │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  RECENT CHANGES (THIS DOC)              │
│  - Phase 1: Tooltips ✅                 │
│  - Phase 2: Colors ✅                   │
│  - Phase 3: Constellation Fix ✅        │
│  - Phase 4: House Positioning ✅        │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  FUTURE ENHANCEMENTS                    │
│  - Prioritized feature requests         │
│  - Technical debt items                 │
│  - Performance improvements             │
└─────────────────────────────────────────┘
```

### Color Coding for Miro
- 🟢 Green: Completed features
- 🟡 Yellow: In progress
- 🔵 Blue: Technical notes
- 🟣 Purple: Design decisions
- 🔴 Red: Blockers/issues

---

## 📅 Version History

### v1.0 - Initial Release
- 4 view modes implemented
- Basic sentence generation
- Spiral 3D visualization
- API integration

### v1.1 - Tooltip Overhaul
- React Portal implementation
- Fixed positioning system
- Z-index optimization

### v1.2 - Color System
- Dynamic variable colors
- Planet-specific colors
- Sign-specific colors
- Aspect color integration

### v1.3 - Constellation Fix
- Variable resolution enhancement
- Nested path navigation
- Hover data improvement

### v1.4 - House Positioning
- Top center layout for house view
- View mode labels
- Container size optimization

---

## 🎯 Success Metrics

### User Engagement
- Time spent in each view mode
- Number of houses/planets explored
- Tooltip hover interactions
- Interpretation panel opens

### Technical Performance
- Load time < 3 seconds
- 60 FPS in 3D visualization
- Tooltip response < 100ms
- API response < 2 seconds

### Quality Indicators
- Zero console errors
- All variables resolve correctly
- Tooltips never hidden behind Canvas
- Sentences readable in all contexts

---

*Last Updated: 2025-11-17*
*Prototype Version: 1.4*
*Developed with React Three Fiber, Framer Motion, and love for the cosmos* ✨
