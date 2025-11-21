# Astrologer API Integration Guide

This document explains how to set up and use the Astrologer API integration in the Cosmic Houses project.

## Setup Instructions

### 1. Get Your RapidAPI Key

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Astrologer API](https://rapidapi.com/ajith/api/astrologer)
3. Copy your API key from the dashboard

### 2. Configure Environment Variables

Create a `.env` file in the root of your project (or add to your existing `.env`):

```bash
REACT_APP_ASTROLOGER_API_KEY=your_rapidapi_key_here
```

**Important**: Never commit your `.env` file to version control. Make sure `.env` is in your `.gitignore`.

### 3. Restart Your Development Server

After adding the environment variable, restart your development server:

```bash
npm start
# or
yarn start
```

## Architecture Overview

The integration consists of several key components:

### Core Files

- **`/utils/AstrologyApiClient.ts`** - API client for fetching birth chart data
- **`/utils/AstroDataRegistry.ts`** - Loads and types local dataset JSONs
- **`/utils/ChartEnricher.ts`** - Enriches API data with local symbolic data
- **`/contexts/ChartContext.tsx`** - React context for global chart state
- **`/utils/SentenceEngine.ts`** - Generates poetic sentences from templates
- **`/components/OnboardingFlow.tsx`** - 3-step onboarding UI

### Data Files

- **`/data/newest_integrated_dataset.json`** - Archetypal data for planets, signs, houses, aspects
- **`/data/sentence_templates.json`** - Poetic sentence templates with placeholder schemas

## User Flow

1. **Onboarding** - User enters birth data (name, date/time, location)
2. **API Call** - System fetches birth chart from Astrologer API
3. **Enrichment** - API data is enriched with archetypal meanings from local dataset
4. **Visualization** - Enriched chart is passed to spiral visualization
5. **Interaction** - User explores houses, planets, and aspects with poetic descriptions

## Using the Chart Context

Any component can access the chart data using the `useChart()` hook:

```tsx
import { useChart } from "../contexts/ChartContext";

function MyComponent() {
  const { chart, loading, error, subject } = useChart();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chart) return null;

  // Access enriched data
  const { planets, houses, aspects } = chart;

  // Example: Get a specific planet
  const sun = planets.find((p) => p.planet.name === "Sun");
  console.log(sun?.planet.archetype_figure_name); // "The Radiant One"
  console.log(sun?.sign.name); // e.g., "Leo"
  console.log(sun?.house.name); // e.g., "House of Expressive Joy & Inner Child"

  return <div>...</div>;
}
```

## Generating Poetic Sentences

Use the `SentenceEngine` to generate contextual poetic descriptions:

```tsx
import { generateInteractiveSentence } from "../utils/SentenceEngine";
import InteractiveSentence from "../components/InteractiveSentence";

function MyView() {
  const { chart } = useChart();
  const planet = chart.planets[0]; // Example: first planet

  const { sentence, tokens } = generateInteractiveSentence(
    "planet_focus",
    {
      planet: planet,
      sign: planet.sign,
      house: planet.house,
    },
  );

  return (
    <InteractiveSentence
      tokens={tokens}
      className="text-lg text-white/90"
    />
  );
}
```

## Available Sentence Contexts

- `spiral_overview` - Whole spiral view
- `house_focus` - When a house layer is selected
- `planet_focus` - When zoomed into a specific planet
- `aspect_web` - For aspect descriptions
- `constellation_view` - Constellation mode

## Data Structure

### EnrichedPlanet

```typescript
{
  api: {
    name: string;           // "Sun"
    sign: string;           // "Leo"
    house_id: number;       // 5
    degree: number;         // 125.43
  },
  planet: {
    name: string;
    archetype_name: string;          // "The Core Self"
    archetype_figure_name: string;   // "The Radiant One"
    essence: string;
    visual_elements: string[];
    color: string;
  },
  sign: {
    name: string;
    archetype_name: string;
    element: string;
    visual_mappings: {
      shape: string;
      motion: string;
      texture: string;
      palette: string;
      rhythm: string;
    }
  },
  house: {
    house: number;
    name: string;           // "House of Expressive Joy & Inner Child"
    essence: string;
    keywords: string[];
    visual_elements: string[];
  }
}
```

### EnrichedAspect

```typescript
{
  api: {
    p1_name: string;
    p2_name: string;
    type: string;           // "trine", "square", etc.
    orb: number;
    exact: boolean;
  },
  from: EnrichedPlanet,
  to: EnrichedPlanet,
  library: {
    name: string;
    angle: number;
    quality: string;
    keywords: string[];
    color: string;
  }
}
```

## Customization

### Adding New Templates

Edit `/data/sentence_templates.json` to add new poetic templates:

```json
{
  "id": "my_template_01",
  "context": "house_focus",
  "template": "Your custom {{variable}} template here.",
  "weight": 1,
  "placeholder_schema": {
    "variable": {
      "path": "planet.essence",
      "description": "Description for hover",
      "hover_summary": "What users see on hover"
    }
  }
}
```

### Extending the Dataset

Edit `/data/newest_integrated_dataset.json` to customize archetypal meanings, colors, and visual mappings.

## Troubleshooting

### API Key Issues

If you see "ASTROLOGER_API_KEY is not set":

- Check that your `.env` file exists in the project root
- Verify the variable name is exactly `REACT_APP_ASTROLOGER_API_KEY`
- Restart your development server

### CORS Errors

The Astrologer API should handle CORS properly. If you encounter issues:

- Verify your RapidAPI subscription is active
- Check the API endpoint is correct
- Try testing the API directly in RapidAPI's test interface

### Data Not Matching

If planet/sign/house names from the API don't match your local dataset:

- Check console warnings for "not found in dataset" messages
- Update the dataset JSON to include any missing entries
- The normalization layer is case-insensitive for matching

## Next Steps

1. **Connect real planet positions** - Update `Spiral.tsx` to use `chart.planets` positions via `getPlanetSpiralPosition()`
2. **Wire sentence generation** - Update `FloatingPoeticSentence`, `PlanetPoeticOverlay`, etc. to use `generateInteractiveSentence()`
3. **Add place search** - Integrate a geocoding API in `OnboardingFlow` for automatic lat/long lookup
4. **Enhance aspects** - Use `chart.aspects` in `ConstellationView` for real aspect visualization
5. **Add persistence** - Store user charts in localStorage or a database

## Support

For API-related issues, consult:

- [Astrologer API Documentation](https://rapidapi.com/ajith/api/astrologer)
- [RapidAPI Support](https://rapidapi.com/support)

For integration issues, review the console logs and error messages for detailed information.