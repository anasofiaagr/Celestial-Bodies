# 🌟 Explanatory Cue Star System

An interactive educational layer that helps non-astrology users understand the logic behind each view through floating star icons that expand into explanatory text on hover.

---

## 🎨 Visual Design

### State A: Collapsed Star
- **Size**: 32px container with 20px sparkles icon
- **Icon**: Sparkles icon with small "i" indicator badge
- **Animation**: 
  - Slow vertical drift (4s loop)
  - Gentle horizontal drift (5s loop)
  - Pulsing outer glow (2.5s loop)
- **Opacity**: 80%
- **Cursor**: Help cursor

### State B: Expanded Bubble (on hover)
- **Width**: 320-384px (responsive)
- **Background**: `rgba(10, 10, 20, 0.85)` with backdrop blur
- **Border**: White/10% opacity
- **Nebula halo**: Gradient blur effect (cyan/purple/pink)
- **Animation**: 200ms smooth expand/collapse
- **Contains**: Title + explanatory text

---

## 📍 View Modes & Cue Placement

### 🌀 Spiral Overview (4 cues)
Distributed in four corners for balanced framing:

1. **"What the Spiral Is"** - Top right (12%, 5%)
   - Explains the moving ecology of planets/signs/houses
   
2. **"Why Triads Matter"** - Top left (12%, 5%)
   - Explains the three-part sentence structure
   
3. **"How to Navigate"** - Bottom left (12%, 5%)
   - Explains interaction and non-deterministic nature
   
4. **"The Philosophy"** - Bottom right (12%, 5%)
   - Explains metaphor vs prediction approach

### 🏠 House Layer View (3 cues)
Symmetric placement on sides and bottom:

1. **"What a House Means"** - Left side (40%, 8%)
   - Houses as life-fields/terrains
   
2. **"Why a Planet in a House Matters"** - Right side (40%, 8%)
   - Planets animate house fields
   
3. **"The Sign Layer"** - Bottom center (15%, 50%)
   - Sign sets the tone for expression

### 🪐 Planet View (2 cues)
Vertically aligned on right side:

1. **"Planet Logic"** - Top right (20%, 15%)
   - Planets as verbs, not objects
   
2. **"Why Sign + House Influence It"** - Bottom right (20%, 15%)
   - Sign = style, House = stage

### ✨ Constellation View (2 cues)
Positioned at top corners:

1. **"What Aspects Are"** - Top left (10%, 10%)
   - Aspects as angles/relationships
   
2. **"Why It Forms a Constellation"** - Top right (10%, 10%)
   - Unique chart shape as energy map

---

## 🛠️ Component Structure

### `CueStar.tsx`
Main interactive component with two states:
- Props: `title`, `text`, `position`, `delay`
- Handles hover state management
- AnimatePresence for smooth transitions
- Fixed positioning with configurable coordinates

### `CueStarContainer.tsx`
View mode manager:
- Props: `viewMode` ('spiral' | 'house' | 'planet' | 'constellation')
- Contains all cue content definitions
- Maps cues to appropriate positions per view
- Handles staggered delay animations

### Integration in `SpiralVisualization.tsx`
- Determines current view mode based on state
- Hides cues when interpretation panel is open
- Renders above all other UI elements (z-50)

---

## 📝 How to Edit Cue Text

All cue content is centralized in `/components/CueStarContainer.tsx`:

```typescript
const CUE_CONTENT = {
  spiral: [
    {
      title: "Your Title Here",
      text: "Your explanation text here...",
      position: { top: '20%', right: '8%' }
    }
  ],
  // ... other views
};
```

### To Add a New Cue:
1. Add object to appropriate view array in `CUE_CONTENT`
2. Set `title`, `text`, and `position` (CSS coordinates)
3. Cue will auto-appear with staggered delay

### To Edit Existing Cue:
1. Find the cue in `CUE_CONTENT`
2. Edit `title` or `text` directly
3. Adjust `position` if needed

---

## 🎯 Design Philosophy

### Why Cues Exist
- **Educational**: Help non-astrology users understand concepts
- **Non-intrusive**: Collapse to small stars when not needed
- **Fixed text**: Not variable-driven like sentence engine
- **Universal**: Explain the "why" and "how" of each view

### Interaction Model
- **Hover only**: No click required
- **Instant feedback**: Expand/collapse in 200ms
- **Always available**: Float above all other elements
- **Contextual**: Different cues for each view mode

### Visual Language
- **Cyan glow**: Matches cosmic/tech aesthetic
- **Sparkles icon**: Suggests discovery/insight
- **"i" indicator**: Makes info purpose clear
- **Nebula effect**: Ties to celestial theme

---

## 🚀 Future Enhancements

Potential additions:
- [ ] Add optional sound effect on expand
- [ ] Implement "dismiss forever" functionality
- [ ] Add keyboard shortcuts to cycle through cues
- [ ] Create onboarding tour that highlights each cue
- [ ] Track which cues users interact with most
- [ ] Add animation trail when moving between views
- [ ] Localization support for multiple languages

---

## 🔧 Technical Notes

### Performance
- Uses AnimatePresence for smooth mount/unmount
- Animations run on GPU (transform/opacity only)
- Hover state is local to each CueStar
- No re-renders on other component state changes

### Accessibility
- Help cursor indicates interactivity
- "i" icon provides visual cue for info purpose
- Text is readable with high contrast
- Could add keyboard focus support in future

### z-index Hierarchy
```
z-50: CueStars
z-40: FloatingPoeticSentence
z-30: UI overlays
z-20: Canvas overlays
z-10: UI buttons
z-0: 3D Canvas
```

---

*Created as an educational layer to make astrology concepts accessible to all users while maintaining the poetic, non-deterministic philosophy of Celestial Bodies.* ✨
