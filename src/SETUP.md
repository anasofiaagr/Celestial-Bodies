# 🌌 Celestial Bodies - Setup Guide

Quick setup guide to get Celestial Bodies running locally or in GitHub Codespaces.

---

## 🚀 Quick Start (5 Minutes)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/celestial-bodies.git
cd celestial-bodies

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the dev server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

That's it! 🎉

---

## ☁️ GitHub Codespaces (Recommended for Cloud)

1. **Open Repository on GitHub**
2. **Click "Code" → "Codespaces" → "Create codespace"**
3. **Wait ~2 minutes** for setup (automatic)
4. **Start dev server** when ready:
   ```bash
   npm run dev
   ```
5. **Click "Open in Browser"** when port 5173 notification appears

---

## 📋 Prerequisites

### Required
- **Node.js 18+** ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### Optional
- **Git** for version control
- **VS Code** for best development experience
- **RapidAPI Account** for live astrology data ([sign up](https://rapidapi.com/))

---

## 🔑 API Configuration

The project uses the Astrologer API via RapidAPI.

### Update API Key

Open `/utils/AstrologyApiClient.ts` and replace the key:

```typescript
const ASTROLOGER_API_KEY = "your-rapidapi-key-here";
```

### Get a Free API Key

1. Go to [RapidAPI Astrologer API](https://rapidapi.com/prokerala-prokerala-default/api/astrologer)
2. Sign up / log in
3. Subscribe to the free tier (100 requests/month)
4. Copy your API key
5. Paste into `/utils/AstrologyApiClient.ts`

**Note**: The app includes quota error handling, so it degrades gracefully if quota is exceeded.

---

## 🛠️ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📦 Project Structure

```
celestial-bodies/
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── glossary/           # Knowledge base system
│   ├── ConstellationView.tsx
│   ├── Spiral.tsx
│   └── ...
├── contexts/               # React Context (state management)
│   ├── ChartContext.tsx
│   └── GlossaryContext.tsx
├── data/                   # JSON datasets and templates
│   ├── sentence_templates.ts
│   ├── glossary.json
│   └── ...
├── utils/                  # Helper functions
│   ├── AstrologyApiClient.ts
│   ├── ChartEnricher.ts
│   ├── SentenceEngine.ts
│   └── ...
├── styles/                 # Global CSS
│   └── globals.css
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies
└── vercel.json             # Deployment config
```

---

## 🔧 Troubleshooting

### Port 5173 Already in Use

```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Dependency Installation Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Three.js Warnings in Console

These are normal and suppressed in production. Safe to ignore during development.

### "Module not found" Errors

1. Ensure you're in the project root directory
2. Check that `node_modules` exists
3. Try reinstalling: `npm install --legacy-peer-deps`

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit

# If errors persist, ensure TypeScript is installed
npm install -D typescript @types/react @types/react-dom
```

---

## 🎨 VS Code Setup (Recommended)

### Install Recommended Extensions

VS Code will prompt you to install recommended extensions when you open the project. Or install manually:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Class name completion
- **Auto Rename Tag** - HTML/JSX tag renaming
- **GitLens** - Git integration

### Enable Format on Save

VS Code settings (`.vscode/settings.json`) are included in the project and will auto-enable format on save.

---

## 🌐 Browser Compatibility

### Fully Supported
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 15+
- ✅ Edge 90+

### Limited Support
- ⚠️ Older browsers may have issues with 3D rendering
- ⚠️ Mobile browsers work but experience is optimized for desktop

---

## 📱 Testing on Mobile

### Local Network Testing

1. Start dev server: `npm run dev`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On mobile, navigate to: `http://YOUR_IP:5173`

### Mobile-Specific Issues

- Touch controls work for orbital camera
- Some 3D performance may vary on older devices
- Constellation download tested on iOS Safari and Chrome Android

---

## 🎯 First Run Checklist

After setup, verify everything works:

- [ ] Dev server starts without errors
- [ ] App loads in browser
- [ ] No console errors (except Three.js warnings)
- [ ] Can enter birth data in onboarding
- [ ] Location search autocomplete works
- [ ] Chart renders with 3D spiral
- [ ] Can switch between view modes
- [ ] Can select houses and planets
- [ ] Constellation download works
- [ ] Responsive design works (resize browser)

---

## 🚢 Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment instructions.

Quick deploy to Vercel:
```bash
npm i -g vercel
vercel login
vercel
```

---

## 🆘 Need Help?

1. **Check existing issues**: [GitHub Issues](https://github.com/yourusername/celestial-bodies/issues)
2. **Read the docs**: See README.md, DEPLOYMENT.md, CONTRIBUTING.md
3. **Open a new issue**: Provide details, screenshots, console errors

---

## 🎉 You're Ready!

Your development environment is set up. Start exploring the code, make changes, and watch the cosmic visualization come to life.

**Pro tip**: Start by looking at:
- `/App.tsx` - Main application logic
- `/components/Spiral.tsx` - 3D spiral structure
- `/utils/SentenceEngine.ts` - Poetic text generation
- `/data/sentence_templates.ts` - Template definitions

Built with contemplation, designed for beauty 🌌✨
