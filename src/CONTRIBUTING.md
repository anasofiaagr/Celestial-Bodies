# Contributing to Celestial Bodies

Thank you for your interest in contributing! This project is primarily a personal art/design work, but thoughtful contributions are welcome.

## 🌟 Philosophy

Celestial Bodies is designed as a contemplative, poetic tool for astrological reflection. All contributions should align with these core principles:

- **Anti-essentialist**: Avoid deterministic language or fixed personality frameworks
- **Poetic over clinical**: Language should feel literary, not algorithmic
- **Contemplative pace**: Motion and interaction should support slow, meditative engagement
- **Atmospheric design**: Visual elements should create depth and atmosphere without overwhelming

## 🛠️ Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/celestial-bodies.git
   cd celestial-bodies
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📋 Areas for Contribution

### High Priority
- **Performance optimizations** for 3D rendering
- **Accessibility improvements** (keyboard navigation, screen readers)
- **Mobile/responsive enhancements**
- **Additional sentence templates** (must be poetic, non-deterministic)
- **Bug fixes** and error handling

### Medium Priority
- **New view modes** (if they serve the contemplative intent)
- **Additional astronomical data** (asteroids, nodes, etc.)
- **Localization/internationalization**
- **Alternative color palettes** (must maintain atmospheric quality)

### Not Accepting
- ❌ Gamification features
- ❌ Social/sharing features (beyond the constellation download)
- ❌ Traditional astrological interpretations (cookbook-style)
- ❌ UI complexity that breaks the minimal aesthetic
- ❌ Sound/music (silence is intentional)

## 🎨 Code Style

- **TypeScript**: Use strict typing, avoid `any` when possible
- **React**: Functional components with hooks
- **Naming**: Descriptive variable names (e.g., `spiralSentenceTokens`, not `tokens`)
- **Comments**: Explain *why*, not *what*
- **File structure**: Keep components focused and single-purpose

### Example Good Code

```typescript
// Good: Descriptive, typed, clear purpose
interface PlanetNodeProps {
  position: [number, number, number];
  color: string;
  isSelected: boolean;
  onSelect: (planetName: string) => void;
}

export function PlanetNode({ position, color, isSelected, onSelect }: PlanetNodeProps) {
  // Component implementation
}
```

### Example Less Good Code

```typescript
// Less good: Vague naming, missing types
function Node({ pos, col, sel, onClick }: any) {
  // Component implementation
}
```

## 🔀 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear commit messages
   - Test thoroughly in dev environment
   - Ensure build succeeds: `npm run build`

3. **Test the production build**
   ```bash
   npm run preview
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Describe what you changed and why
   - Reference any related issues
   - Include screenshots/video if visual changes
   - Explain how you tested

### PR Checklist

- [ ] Code follows project style
- [ ] No TypeScript errors
- [ ] Production build succeeds
- [ ] Tested in multiple browsers
- [ ] Responsive design maintained
- [ ] No breaking changes to existing features
- [ ] Documentation updated (if needed)

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: What happened vs. what you expected
- **Steps to reproduce**: Detailed steps to trigger the bug
- **Environment**: Browser, OS, device
- **Screenshots/video**: If applicable
- **Console errors**: Check browser console for errors

### Example Bug Report

```markdown
**Bug**: Constellation download generates corrupted image on Safari

**Steps to Reproduce:**
1. Enter birth data and view chart
2. Switch to Constellation View
3. Click "Download Constellation"
4. Image downloads but appears blank

**Environment:**
- Browser: Safari 17.2
- OS: macOS Sonoma 14.2
- Device: MacBook Pro 2023

**Console Errors:**
```
Canvas: Uncaught DOMException: Failed to execute 'toBlob' on 'HTMLCanvasElement'
```

**Expected**: High-res PNG with chart visualization
**Actual**: Blank/corrupted image
```

## 💡 Suggesting Features

Feature suggestions are welcome, but please understand:

- This is an art project with a specific vision
- Not all suggestions will be implemented
- Features must serve the contemplative intent

When suggesting features:

1. **Explain the user need**: What problem does this solve?
2. **Align with philosophy**: How does this serve contemplation?
3. **Consider scope**: Is this achievable without adding complexity?
4. **Provide mockups**: Visual examples help (optional but appreciated)

## 📚 Resources

- **Three.js Docs**: [threejs.org/docs](https://threejs.org/docs/)
- **React Three Fiber**: [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
- **Vite Guide**: [vitejs.dev/guide](https://vitejs.dev/guide/)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🙏 Code of Conduct

- Be respectful and constructive
- Focus on the work, not the person
- Assume good intent
- Prioritize the user experience
- Honor the contemplative philosophy of the project

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for helping make Celestial Bodies more beautiful and contemplative! 🌌✨
