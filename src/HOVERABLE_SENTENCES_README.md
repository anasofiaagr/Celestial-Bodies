# Hoverable Poetic Sentences System 🌟

## Overview

The Celestial Bodies app now features a complete **hoverable sentence system** that dynamically generates poetic astrological descriptions with interactive tooltips. Each variable in a sentence can be hovered to reveal contextual information pulled from the integrated dataset.

## What We've Built

### 1. **Updated Sentence Templates** (`/sentences_templates.json`)
A comprehensive JSON structure with:
- **Placeholder Schema**: Defines hover behavior for each variable type (planets, signs, houses, aspects)
- **Context-Based Templates**: Sentences organized by view mode (spiral overview, house focus, planet focus, etc.)
- **Weighted Randomization**: Templates have different weights to control frequency
- **UI Hints**: Tooltip styling and interaction specifications
- **Color Binding Rules**: Dynamic color assignment based on chart data

### 2. **Enhanced SentenceEngine** (`/utils/SentenceEngine.ts`)
Core logic for:
- Parsing the new JSON template structure
- Resolving data paths like `planets[].archetype_name`
- Building hover summaries from multiple data sources
- Context-aware template selection
- Weighted random picking
- Color extraction from chart data

### 3. **InteractiveSentence Component** (`/components/InteractiveSentence.tsx`)
Renders sentences with:
- Underlined hoverable variables
- Smooth tooltip animations
- Color-coded highlights based on data type
- Contextual titles and summaries in tooltips
- Glow effects on hover

### 4. **SentenceDemo Component** (`/components/SentenceDemo.tsx`)
A floating demo panel accessible via a purple sparkle button that shows:
- All context types (onboarding, spiral, house, planet, constellation, etc.)
- Live sentence generation
- Interactive hover tooltips
- Context switcher

## How It Works

### Template Structure

```json
{
  "id": "spiral_main_01",
  "context": "spiral_overview",
  "placement": "spiral_main_card",
  "weights": 3,
  "text": "Across this spiral, {{planet.archetype_figure_name}} carries {{planet.essence}} through {{house.name}}, coloured by the tone of {{sign.archetype_name}}.",
  "variables": [
    "planet.archetype_figure_name",
    "planet.essence",
    "house.name",
    "sign.archetype_name"
  ]
}
```

### Placeholder Schema

Each variable like `{{planet.essence}}` has a schema entry:

```json
"planet.essence": {
  "path": "planets[].essence",
  "hover": {
    "title": "Essence",
    "summary_from": ["planets[].why"],
    "fallback": "Condensed function of the planet."
  }
}
```

### Hover Tooltip Flow

1. User hovers over underlined text (e.g., "vitality, core self")
2. Component looks up the variable name (e.g., "planet.essence")
3. Retrieves the placeholder schema
4. Builds the summary by concatenating data from `summary_from` paths
5. Displays tooltip with:
   - **Title**: "Essence" (color-coded)
   - **Summary**: Actual data from the chart (e.g., "central organizing principle of identity and purpose")

## Context Types

| Context | Use Case | Example |
|---------|----------|---------|
| `onboarding` | Welcome messages | "Your chart won't tell you who you are..." |
| `spiral_overview` | Main holistic view | "Across this spiral, The Hero carries vitality..." |
| `house_ring_caption` | Short labels on house layers | "Where emergence quietly shapes your days." |
| `house_focus` | Side panel when viewing a house | "In Emergence & Self-Projection, attention turns to..." |
| `planet_focus` | Panel when zooming into a planet | "The Hero carries the work of vitality..." |
| `visual_overlay` | Pure aesthetic descriptions | "Morphing warm gradients drift across..."  |
| `constellation_view` | Aspect-focused | "Each line lit in #F3722C marks an aspect..." |
| `any` | Reflective prompts | "How does the Sun feel when it moves..." |

## Usage in Your Code

```typescript
import { generateInteractiveSentence } from '../utils/SentenceEngine';
import InteractiveSentence from './InteractiveSentence';

// Create a payload with chart data
const payload = {
  planet: enrichedPlanet,
  sign: fluidSign,
  house: fluidHouse,
  chartData: newestIntegratedDataset.data
};

// Generate sentence
const { tokens, sentence } = generateInteractiveSentence(
  'spiral_overview',
  payload
);

// Render with hover tooltips
<InteractiveSentence tokens={tokens} className="text-white" />
```

## Color Binding

Colors are automatically extracted based on variable type:
- **Planet variables** → Use house color
- **Sign variables** → Use sign palette color
- **Aspect variables** → Use aspect library color

## Testing the System

1. **Run the app** and create a chart through onboarding
2. **Look for the purple sparkle button** in the bottom-right corner
3. **Click it** to open the Sentence Demo panel
4. **Switch between contexts** using the buttons
5. **Hover over underlined text** to see tooltips
6. **Click "Generate New Sentence"** to see different templates

## Next Steps

### Integration Points
- Connect to `FloatingPoeticSentence` for constellation view sentences
- Add to `PlanetPoeticOverlay` for planet focus sentences
- Integrate into `UIOverlay` for house ring captions
- Use in `InterpretationPanel` for richer interpretations

### Future Enhancements
- Add more templates for each context
- Implement aspect-specific sentences
- Create transitional sentences between views
- Add seasonal/temporal variations
- Generate shareable "poem cards" with multiple sentences

## Files Modified/Created

- ✅ `/sentences_templates.json` - Template & schema definitions
- ✅ `/utils/SentenceEngine.ts` - Core parsing logic
- ✅ `/components/InteractiveSentence.tsx` - Hover tooltip rendering
- ✅ `/components/SentenceDemo.tsx` - Demo interface
- ✅ `/App.tsx` - Integrated demo button

## Credits Remaining

**137,391 tokens remaining** out of 200,000 (31% used)

---

*Built with Motion (Framer Motion), React Three Fiber, and lots of cosmic inspiration* ✨🌌
