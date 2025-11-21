# ⚡ Celestial Bodies - Quick Start

Get up and running in 5 minutes. Choose your preferred method below.

---

## 🎯 Choose Your Setup

### Option 1: GitHub Codespaces (Easiest - No Local Setup)

**Best for:** Trying the project without installing anything locally

```
1. Go to GitHub repository
2. Click "Code" → "Codespaces" → "Create codespace on main"
3. Wait ~2 minutes for automatic setup
4. Run: npm run dev
5. Click "Open in Browser"
```

✅ **Pros**: Zero local setup, works anywhere, automatic configuration  
❌ **Cons**: Requires GitHub account, limited free hours

---

### Option 2: Local Development (Recommended)

**Best for:** Active development, full control, offline work

```bash
# Clone the repo
git clone https://github.com/yourusername/celestial-bodies.git
cd celestial-bodies

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Open http://localhost:5173
```

✅ **Pros**: Full control, works offline, no hour limits  
❌ **Cons**: Requires Node.js 18+ installed locally

---

### Option 3: Deploy to Vercel (Production)

**Best for:** Sharing with others, public deployment

```
1. Push code to GitHub
2. Go to vercel.com → Import Project
3. Select your repository
4. Click "Deploy"
5. Done! Get shareable URL
```

✅ **Pros**: Free hosting, automatic SSL, CDN distribution  
❌ **Cons**: Public by default (can be private on paid plan)

---

## 🔑 API Setup (Required for Live Data)

The app needs a RapidAPI key to fetch real natal chart data.

### Get Your Free API Key

1. **Sign up**: [rapidapi.com](https://rapidapi.com/)
2. **Find API**: Search "Astrologer API" or visit [this link](https://rapidapi.com/prokerala-prokerala-default/api/astrologer)
3. **Subscribe**: Choose free tier (100 requests/month)
4. **Copy key**: From API dashboard

### Add Key to Project

Open `/utils/AstrologyApiClient.ts` and replace:

```typescript
const ASTROLOGER_API_KEY = "your-rapidapi-key-here";
```

**Note**: App works without API (uses mock data) but real charts require this.

---

## ✅ Verification Checklist

Make sure everything works:

```
□ Dev server starts (npm run dev)
□ Browser opens to http://localhost:5173
□ No errors in console (Three.js warnings are okay)
□ Can enter birth data
□ Location search works
□ 3D spiral renders
□ Can click houses/planets
□ View modes switch correctly
□ Constellation download works
```

If any fail, see [SETUP.md](./SETUP.md) for troubleshooting.

---

## 📚 Next Steps

### Learn the Codebase

1. **Read**: [README.md](./README.md) - Full project overview
2. **Explore**: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Technical details
3. **Design**: [project-documentation.tsx](./project-documentation.tsx) - Design system

### Key Files to Understand

```
/App.tsx                          # Main application
/components/Spiral.tsx            # 3D visualization
/utils/SentenceEngine.ts          # Poetic text generation
/data/sentence_templates.ts       # Template definitions
/contexts/ChartContext.tsx        # State management
```

### Make Your First Change

Try this simple modification:

**File**: `/components/UIOverlay.tsx`  
**Change**: Update the welcome text in Spiral View

```typescript
// Find this line around line 200:
<p className="...">
  Explore your celestial architecture
</p>

// Change to:
<p className="...">
  Your cosmic journey begins here
</p>
```

Save, and see the change instantly in browser!

---

## 🎨 Project Structure Quick Reference

```
celestial-bodies/
├── components/           # UI components
│   ├── ui/              # Buttons, inputs, etc.
│   ├── Spiral.tsx       # Main 3D spiral
│   ├── ConstellationView.tsx
│   └── ...
├── data/                # Templates and datasets
│   ├── sentence_templates.ts
│   └── glossary.json
├── utils/               # Helper functions
│   ├── AstrologyApiClient.ts
│   ├── SentenceEngine.ts
│   └── ChartEnricher.ts
├── contexts/            # State management
├── styles/              # CSS
└── App.tsx              # Entry point
```

---

## 🚀 Deployment Quick Reference

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Manual Build

```bash
# Build project
npm run build

# Test production build locally
npm run preview

# Upload /build folder to any static host
```

---

## 🐛 Common Issues & Fixes

### "Port 5173 already in use"
```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

### "Module not found" errors
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Build fails
```bash
npm run build
# Check errors, usually TypeScript issues
npx tsc --noEmit
```

### Three.js warnings
These are normal and suppressed. Safe to ignore.

---

## 📖 Documentation Map

- **QUICK_START.md** (you are here) - Get started fast
- **README.md** - Full project overview
- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Vercel and Codespaces guide
- **CONTRIBUTING.md** - How to contribute
- **project-documentation.tsx** - Design system and narrative

---

## 🎯 What to Do Next?

Choose your path:

### 👀 Just Exploring?
- Run `npm run dev`
- Play with the app
- Try different birth data
- Download a constellation

### 🛠️ Want to Customize?
- Read [SETUP.md](./SETUP.md)
- Explore `/data/sentence_templates.ts`
- Modify colors in `/styles/globals.css`
- Add new view modes

### 🚀 Ready to Deploy?
- Read [DEPLOYMENT.md](./DEPLOYMENT.md)
- Push to GitHub
- Deploy on Vercel
- Share your URL!

### 🤝 Want to Contribute?
- Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- Check open issues
- Fork and make changes
- Submit a PR

---

## 💡 Pro Tips

1. **Use the glossary**: Hover over colored text to see definitions
2. **Download constellations**: Beautiful 2048×2048px artifacts
3. **Try all view modes**: Each offers different insights
4. **Responsive design**: Works on mobile (but best on desktop)
5. **Performance**: 3D rendering is GPU-intensive (use modern browser)

---

## 🆘 Get Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/celestial-bodies/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/celestial-bodies/discussions)
- **Email**: (add your contact)

---

## 🎉 Ready!

You're all set. Start exploring the cosmos! 🌌✨

**Remember**: This project is about contemplation, not speed. Take your time, read the code, and let the poetic philosophy guide your understanding.

*"Your birth chart is not a diagnosis; it's a constellation of possibilities."*
