# 🎯 Cue Star Position Map

Visual reference for where cue stars appear in each view mode.

---

## 🌀 Spiral Overview (4 cues)

```
┌─────────────────────────────────────────────────┐
│   ⭐2                                    ⭐1    │  1. "What the Spiral Is"
│                                                 │     (top: 12%, right: 5%)
│                                                 │
│                                                 │  2. "Why Triads Matter"
│          [3D SPIRAL VISUALIZATION]              │     (top: 12%, left: 5%)
│                                                 │
│                                                 │  3. "How to Navigate"
│   ⭐3                                    ⭐4    │     (bottom: 12%, left: 5%)
│                                                 │
└─────────────────────────────────────────────────┘  4. "The Philosophy"
                                                       (bottom: 12%, right: 5%)
```

---

## 🏠 House Layer View (3 cues)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│                                                 │
│  ⭐1                                     ⭐2    │  1. "What a House Means"
│              [HOUSE LAYER CIRCLE]               │     (top: 40%, left: 8%)
│                                                 │
│              [Zodiac Sign Center]               │  2. "Why a Planet Matters"
│                                                 │     (top: 40%, right: 8%)
│                       ⭐3                       │
└─────────────────────────────────────────────────┘  3. "The Sign Layer"
                                                       (bottom: 15%, left: 50%)
```

---

## 🪐 Planet View (2 cues)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                   ⭐1           │  1. "Planet Logic"
│  [Poetic Text]                                  │     (top: 20%, right: 15%)
│  [Left Column]                                  │
│                    [PLANET]                     │
│                                                 │
│                                   ⭐2           │  2. "Why Sign + House"
│                                                 │     (bottom: 20%, right: 15%)
└─────────────────────────────────────────────────┘
```

---

## ✨ Constellation View (2 cues)

```
┌─────────────────────────────────────────────────┐
│   ⭐1                                    ⭐2    │  1. "What Aspects Are"
│                                                 │     (top: 10%, left: 10%)
│                                                 │
│           [CONSTELLATION LINES]                 │  2. "Why It Forms a Constellation"
│                 *    *    *                     │     (top: 10%, right: 10%)
│              *              *                   │
│                 [Aspects]                       │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📐 Position Coordinates Explained

### CSS Positioning
All cues use `position: fixed` with percentage-based coordinates:

```css
{
  top: '20%',      /* 20% from top of viewport */
  right: '8%',     /* 8% from right edge */
  /* OR */
  bottom: '25%',   /* 25% from bottom */
  left: '50%'      /* 50% from left (centered) */
}
```

### Strategic Placement Rules

1. **Avoid overlap with main content**
   - Spiral: Cues on right and bottom
   - House: Cues on sides and bottom
   - Planet: Cues on right side (text is left)
   - Constellation: Cues at top

2. **Visual balance**
   - Distribute around perimeter
   - Never cluster in one area
   - Leave center for main visualization

3. **Reading order**
   - Top-to-bottom, left-to-right
   - Most important concepts first
   - Philosophy/summary concepts last

4. **Responsive considerations**
   - Percentages adapt to screen size
   - May need media queries for mobile
   - Consider touch targets on small screens

---

## 🎨 Cue Star Anatomy

```
     Outer Glow (pulsing, 48px)
          ↓
       ╭───────╮
      ╱         ╲
     │           │
     │    ✨     │ ← Sparkles icon (20px)
     │     ⓘ    │ ← Info indicator (12px)
      ╲         ╱
       ╰───────╯
          ↑
   Inner Glow (32px)
   Star Container (32px)
```

**On Hover** → Expands to explanation bubble:

```
╔════════════════════════════════════╗
║  ✨ Title Here                     ║
║  ───────────────────────────────── ║
║  Explanation text goes here and    ║
║  wraps naturally within the panel. ║
║  Provides context and guidance.    ║
╚════════════════════════════════════╝
       ↑
   Nebula Halo (gradient blur)
```

---

## 💡 Design Decisions

### Why These Positions?

**Spiral View** - Four corners distribution
- Creates balanced frame around visualization
- Equal spacing creates visual harmony
- None block the main spiral or poetic sentence
- Corner placement keeps them discoverable but unobtrusive

**House View** - Mid-sides + bottom center
- Left and right sides frame the circular layer
- Bottom center for fundamental concept (sign)
- Avoids top center (reserved for poetic sentence)
- Symmetric positioning creates balance

**Planet View** - Right side vertical
- Left side has poetic overlay text
- Right side is clear, perfect for cues
- Symmetric top/bottom positioning
- Closer to center for better visibility

**Constellation View** - Top corners
- Top placement avoids constellation complexity
- Corner positioning gives breathing room
- Symmetric left/right creates balance
- More visible above the aspect lines

### Why Hover Instead of Click?

- **Lower friction**: No commitment required
- **Discoverability**: Natural exploration pattern
- **Non-intrusive**: Doesn't break flow
- **Reversible**: Leave to collapse, no "close" needed

### Why Fixed Text?

- **Consistency**: Same explanation every time
- **Reliability**: No variable resolution errors
- **Performance**: No computation needed
- **Clarity**: Written specifically for education

---

## 🔧 How to Adjust Positions

Edit `/components/CueStarContainer.tsx`:

```typescript
const CUE_CONTENT = {
  spiral: [
    {
      title: "Your Title",
      text: "Your text...",
      position: { 
        top: '20%',    // ← Adjust these
        right: '8%'    // ← Adjust these
      }
    }
  ]
};
```

### Testing Checklist
- [ ] Cue doesn't overlap main content
- [ ] Cue is visible on 1920x1080 screen
- [ ] Cue is visible on 1280x720 screen
- [ ] Expanded bubble doesn't go off-screen
- [ ] Multiple cues don't overlap each other
- [ ] Position feels balanced in the view
- [ ] Follows reading order (top→bottom, left→right)

---

*Use this guide when adding new cues or adjusting existing positions to maintain visual harmony across all view modes.* 🌟
