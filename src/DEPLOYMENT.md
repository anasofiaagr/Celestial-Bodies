# 🚀 Deployment Guide

This guide covers deploying **Celestial Bodies** to Vercel and working with GitHub Codespaces.

---

## 📦 Prerequisites

- Node.js 18+
- npm or yarn
- GitHub account
- Vercel account (free tier works!)
- RapidAPI key for Astrologer API

---

## 🌐 Deploy to Vercel

### Option 1: Quick Deploy (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Celestial Bodies"
   git branch -M main
   git remote add origin https://github.com/yourusername/celestial-bodies.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 🔧 Environment Variables

If you need to add environment variables (like API keys):

### In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables:
   - `VITE_RAPIDAPI_KEY` — Your RapidAPI key
   - `VITE_API_ENDPOINT` — API endpoint (if needed)

### Locally:
Create `.env.local` file:
```env
VITE_RAPIDAPI_KEY=67849484c7mshca0cd2e16dc5081p1f0c35jsn3b5dc991b1de
```

**Note:** Currently the API key is hardcoded in `/utils/AstrologyApiClient.ts`. For production, consider moving it to environment variables.

---

## 💻 GitHub Codespaces

### Quick Start

1. **Open in Codespaces**
   - Go to your GitHub repository
   - Click green "Code" button
   - Select "Codespaces" tab
   - Click "Create codespace on main"

2. **Wait for Setup**
   - Codespace will automatically run `npm install --legacy-peer-deps`
   - Port 5173 will be forwarded automatically

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Access the App**
   - VS Code will show a notification: "Your application is running on port 5173"
   - Click "Open in Browser" or use the Ports tab

### Codespace Configuration

The project includes `.devcontainer/devcontainer.json` which:
- Uses Node.js 18
- Installs recommended VS Code extensions
- Forwards port 5173 automatically
- Runs `npm install --legacy-peer-deps` on container creation

### Tips for Codespaces

- **Persistent Storage**: Your `node_modules` are cached
- **Multiple Terminals**: Run dev server in one, commands in another
- **VS Code Extensions**: All recommended extensions auto-install
- **Port Forwarding**: Ports are private by default (only you can access)

---

## 🔍 Verifying Deployment

### Check Build Locally First

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### Common Issues

#### Issue: "Module not found" errors
**Solution:** Make sure all imports use correct paths. Check `vite.config.ts` base path.

#### Issue: Build fails on Vercel
**Solution:** Check Vercel build logs. Usually caused by:
- Missing dependencies in `package.json`
- Type errors in TypeScript
- Environment variables not set

#### Issue: Three.js warnings in production
**Solution:** These are suppressed in the app. Safe to ignore.

#### Issue: API quota exceeded
**Solution:** The app has error handling for this. Check your RapidAPI dashboard for quota limits.

---

## 📊 Build Optimization

The `vercel.json` file includes:

- **Cache Headers**: Assets cached for 1 year
- **SPA Routing**: All routes redirect to `index.html`
- **Legacy Peer Deps**: Handles peer dependency conflicts

### Build Performance

Expected build time: **1-2 minutes**

Build output size:
- HTML: ~2 KB
- JS (main): ~500-800 KB (gzipped)
- CSS: ~50-100 KB (gzipped)
- Assets: Varies (3D models, fonts)

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Automatic preview URLs

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-view-mode

# Make changes and commit
git add .
git commit -m "Add new view mode"

# Push to GitHub
git push origin feature/new-view-mode

# Vercel creates preview deployment automatically
# Merge PR when ready → Auto-deploys to production
```

---

## 🎨 Custom Domain

### Add Custom Domain in Vercel:

1. Go to Project Settings → Domains
2. Add your domain (e.g., `celestialbodies.com`)
3. Follow DNS configuration instructions
4. SSL is automatic (via Let's Encrypt)

---

## 📈 Monitoring

### Vercel Analytics (Optional)

Enable in Project Settings → Analytics:
- Page views
- Performance metrics
- User locations
- Device types

### Performance Monitoring

The app includes:
- Three.js performance monitoring (dev mode)
- Console warnings for API failures
- Error boundaries for React errors

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules build
npm install --legacy-peer-deps
npm run build
```

### Port 5173 Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Vercel Deployment Stuck

- Check build logs in Vercel dashboard
- Ensure `package.json` scripts are correct
- Verify `vite.config.ts` is valid
- Check for TypeScript errors: `npx tsc --noEmit`

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Update API key in `/utils/AstrologyApiClient.ts`
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Check console for errors in production build
- [ ] Verify all view modes work correctly
- [ ] Test constellation download feature
- [ ] Ensure responsive design works on mobile
- [ ] Test location search (geocoding)
- [ ] Verify API error handling
- [ ] Update README with your actual repo URL
- [ ] Add license information
- [ ] Set up custom domain (optional)

---

## 🎉 Success!

Your app is now deployed! Share the URL and watch users explore their cosmic topography.

**Live URL Format:**
- `https://your-project.vercel.app` (Vercel subdomain)
- `https://yourdomain.com` (custom domain)

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)
- **GitHub Codespaces**: [github.com/features/codespaces](https://github.com/features/codespaces)

Built with contemplation, deployed with confidence 🌌✨
