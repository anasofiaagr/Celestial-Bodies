# 🌌 Celestial Bodies

**A Poetic Journey Through Personal Cosmology**

Celestial Bodies is an interactive 3D natal chart visualization that reimagines astrology as a living, evolving poetic artifact. Rather than reducing individuals to fixed archetypes, it presents birth charts as a 12-layer helical spiral—a cosmic topography where planets orbit through houses, aspects connect distant energies, and the entire structure breathes with subtle motion.

![Celestial Bodies Preview](https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80)

## ✨ Features

- **3D Helical Spiral Structure**: 12-layer spiral representing the 12 astrological houses
- **10 Orbital Planet Nodes**: Real-time calculation of planet positions based on birth data
- **Complete Aspect Calculation System**: Visual aspect lines connecting related planets
- **Multiple View Modes**:
  - 🌀 **Spiral View** — Holistic poetic sentence on the right side
  - 🏠 **House View** — Contextual sentences per selected house
  - 🪐 **Planet View** — Intimate micro-narratives for each planet
  - ⭐ **Constellation View** — Aspects-only with floating poetic phrases
  - 🌱 **Evolving View** — Natal chart as living, evolving content
- **High-Resolution Constellation Maps**: Downloadable 2048×2048px artifacts
- **Integrated Astrologer API**: Real natal chart calculations via RapidAPI
- **Automatic Geocoding**: Location search using OpenStreetMap's Nominatim API
- **Poetic, Anti-Essentialist Text**: Relational, reflective interpretations using fusion labels

## 🎨 Visual Tone

Soft, cinematic gradients with slow, subtle motion and minimal UI. Deep space purples, ethereal blues, and golden accents create an atmosphere of contemplation. Typography ranges from whisper-thin to emphatic, mirroring astrological language that moves between suggestion and significance.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- RapidAPI key for Astrologer API (get one at [RapidAPI](https://rapidapi.com/))

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/celestial-bodies.git
cd celestial-bodies

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

### Building for Production

\`\`\`bash
# Create production build
npm run build

# Preview production build
npm run preview
\`\`\`

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to [Vercel](https://vercel.com)
3. Vercel will automatically detect the Vite configuration
4. Deploy!

The project includes `vercel.json` with optimized settings.

### Manual Deployment

\`\`\`bash
# Build the project
npm run build

# The build folder contains the production-ready static files
# Deploy the contents of /build to your hosting provider
\`\`\`

## 📦 Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool and dev server
- **Three.js** — 3D rendering
- **React Three Fiber** — React renderer for Three.js
- **React Three Drei** — Useful helpers for R3F
- **Motion (Framer Motion)** — Animation library
- **Tailwind CSS v4** — Styling
- **Radix UI** — Accessible component primitives
- **Lucide React** — Icon library
- **Recharts** — Data visualization
- **Sonner** — Toast notifications

## 🔑 API Configuration

The project uses the Astrologer API via RapidAPI. Update your API key in `/utils/AstrologyApiClient.ts`:

\`\`\`typescript
const ASTROLOGER_API_KEY = "your-rapidapi-key-here";
\`\`\`

## 📂 Project Structure

\`\`\`
celestial-bodies/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── glossary/       # Glossary/knowledge system
│   └── ...             # View-specific components
├── contexts/           # React Context providers
├── data/               # JSON datasets and templates
├── utils/              # Utility functions and services
├── styles/             # Global styles and Tailwind config
├── public/             # Static assets
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.html          # HTML template
\`\`\`

## 🎭 View Modes Explained

### Spiral View
One holistic poetic sentence that synthesizes the entire chart. Displayed on the right side with colored inline tokens representing different astrological elements.

### House View
Click any of the 12 house layers to see contextual interpretations specific to that life domain (self, resources, communication, home, creativity, health, partnership, transformation, philosophy, career, community, transcendence).

### Planet View
Select individual planets to read 1-3 intimate sentences about how that planetary energy manifests in the chart. Each planet has its own color and poetic signature.

### Constellation View
Shows only the aspect lines (conjunctions, trines, squares, sextiles, oppositions) with floating poetic phrases. The spiral fades to emphasize relational geometry.

### Evolving View
Presents the natal chart as a process rather than a fixed state. Text suggests becoming, potentials, and the unfolding nature of selfhood.

## 🎨 Design System

See `/project-documentation.tsx` for complete design system documentation including:
- Color palette and justifications
- Typography hierarchy
- Motion and interaction principles
- Visual tone and moodboard

## 🤝 Contributing

This is a personal art/design project, but if you'd like to suggest improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project as inspiration or starting point for your own work.

## 🙏 Acknowledgments

- **Astrologer API** via RapidAPI for natal chart calculations
- **OpenStreetMap Nominatim** for geocoding services
- **Three.js** community for 3D rendering tools
- Inspired by the work of contemporary astrologers who approach the practice as poetic, non-deterministic art

## 📞 Contact

For questions or feedback, open an issue on GitHub.

---

**Built with contemplation, designed for beauty** 🌌✨
