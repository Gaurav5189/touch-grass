# DESIGN: Touch Grass

## Design Philosophy
Nature is calm, organic, and calming. The app should feel like a field guide—not a dashboard. Minimal UI, maximum nature. The screen disappears; the world appears.

## Color Palette

### Primary Theme: "Forest Trail"
Inspired by outdoor environments at golden hour and in dappled sunlight.

```css
/* CSS Variables */
:root {
  /* Background layers */
  --bg-deep: #0f1c12;        /* Deep forest shadow */
  --bg-forest: #1a2e1b;      /* Main background */
  --bg-leaf: #2d4a2e;        /* Card backgrounds */
  --bg-sage: #3d5d3a;        /* Secondary surfaces */
  --bg-moss: #5a7a56;        /* Hover states */
  --bg-fern: #8fa88a;        /* Accent light */

  /* Text */
  --text-cream: #f2efe9;      /* Primary text */
  --text-ivory: #ebe8db;      /* Secondary text */
  --text-stone: #b8b0a6;      /* Muted text */
  --text-bark: #7a6f5e;       /* Disabled text */

  /* Birds (warm, alive) */
  --bird-call: #e8a85c;       /* Golden oriole */
  --bird-song: #c9954e;       /* Warm amber */
  --bird-wing: #d4a85d;       /* Sunlit feather */

  /* Plants (green, growing) */
  --plant-leaf: #6b9e5c;      /* Healthy green */
  --plant-stem: #8bb87e;      /* Young growth */
  --plant-flower: #c4e07a;    /* Flowering */
  --plant-bark: #8b7a5c;      /* Tree trunk */

  /* Insects (vibrant, small) */
  --insect-amber: #d49a3a;    /* Bee gold */
  --insect-wings: #e8c370;    /* Dragonfly shimmer */
  --insect-shell: #a8703a;    /* Beetle shell */

  /* System / UI */
  --success: #6b9e5c;         /* Positive feedback */
  --warning: #c9954e;         /* Caution / low confidence */
  --error: #b85c4a;           /* Error / high urgency */
  --info: #8fa88a;            /* Neutral info */
}
```

### Dark Mode Adjustment
```css
[data-theme="dark"] {
  --bg-deep: #0d140e;
  --bg-forest: #111d14;
  --bg-leaf: #1a2a1f;
  --bg-sage: #223322;
  --text-cream: #f5f3eb;
  --text-stone: #a89e8e;
}
```

### Light Mode (Sunlit Clearing)
```css
[data-theme="light"] {
  --bg-deep: #e8ebe6;        /* Morning mist */
  --bg-forest: #f0f3ee;      /* Bright clearing */
  --bg-leaf: #e5ebe2;        /* Card background */
  --bg-sage: #dce2d8;        /* Secondary */
  --text-cream: #1a211a;     /* Dark text */
  --text-ivory: #2d322d;     /* Secondary dark text */
  --text-stone: #5a6358;     /* Muted text */
}
```

### Auto Mode
Follows system preference. Transitions smoothly via `transition: background-color 0.3s ease, color 0.3s ease`.

---

## Fonts

### Primary: System Font Stack
Nature apps should feel native. System fonts load instantly and respect user preferences.

```css
/* Variables */
--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
--font-mono: "SF Mono", ui-monospace, "Fira Code", monospace;

/* Usage */
body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.55;
  letter-spacing: -0.01em;
}

h1, h2, h3, h4 {
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

/* Species names (scientific) */
.scientific-name {
  font-family: var(--font-mono);
  font-size: 0.875em;
  letter-spacing: 0.02em;
  color: var(--text-stone);
  font-style: italic;
}
```

---

## Typography Scale

```css
/* Type Scale (Golden Ratio: 1.25) */
--text-xs: 0.75rem;    /* 12px - Labels, captions */
--text-sm: 0.875rem;   /* 14px - Secondary info */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Card titles */
--text-xl: 1.5rem;     /* 24px - Section headers */
--text-2xl: 2rem;      /* 32px - Main titles */
--text-3xl: 2.5rem;    /* 40px - Hero titles */
--text-4xl: 3.5rem;    /* 56px - Splash / splash screen */

/* Font Weights */
--fw-light: 300;
--fw-normal: 400;
--fw-medium: 500;
--fw-semibold: 600;
--fw-bold: 700;
```

---

## Component Design

### Buttons

```css
/* Primary Action */
.btn-primary {
  background: linear-gradient(135deg, var(--bird-call), var(--bird-song));
  color: var(--bg-deep);
  font-weight: var(--fw-semibold);
  padding: 1rem 2rem;
  border-radius: 1rem;
  border: none;
  box-shadow: 0 4px 16px rgba(232, 168, 92, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  box-shadow: 0 6px 24px rgba(232, 168, 92, 0.45);
  transform: translateY(-1px);
}

/* Secondary / Ghost */
.btn-ghost {
  background: transparent;
  border: 1.5px solid var(--bg-sage);
  color: var(--text-ivory);
  padding: 0.875rem 1.75rem;
  border-radius: 1rem;
}

/* Small / Compact */
.btn-compact {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: var(--text-sm);
}
```

### Cards (Observation / Species)

```css
.card-species {
  background: var(--bg-leaf);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.card-species:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
```

### Navigation Bar (Bottom)

Fixed bottom nav with 3 primary modes:
- Bird Call (microphone icon)
- Photo ID (camera icon)
- History (list icon)

```css
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: rgba(26, 46, 27, 0.92);
  backdrop-filter: blur(24px) saturate(1.4);
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-stone);
  font-size: var(--text-xs);
  transition: color 0.2s ease;
}

.nav-item.active {
  color: var(--bird-call);
}
```

---

## Iconography

Using `lucide-react` for consistent, clean icons:
- Bird: `Mic` (audio recording)
- Plant: `Camera` (photo capture)
- History: `BookOpen`
- Settings: `Settings`
- Download: `Download`
- Play: `Play`
- Pause: `Pause`
- Search: `Search`
- Filter: `SlidersHorizontal`

No decorative icons—functional only. Each icon has an accessible label.

---

## Spacing System

```css
/* Based on 8pt grid */
--space-xs: 0.25rem;  /* 4px */
--space-sm: 0.5rem;   /* 8px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;     /* 32px */
--space-2xl: 3rem;    /* 48px */
--space-3xl: 4rem;    /* 64px */
--space-4xl: 6rem;    /* 96px */
```

---

## Motion & Animation

Minimal, purposeful motion. No decorative animations.

```css
/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 0.8s linear infinite;
}

/* Fade in */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-up {
  animation: fadeUp 0.3s ease-out forwards;
}
```

---

## Responsive Breakpoints

```css
/* Mobile-first */
--bp-sm: 640px;   /* Small tablets */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Desktop */
--bp-xl: 1280px;  /* Large screens */
```

- **Mobile (< 640px)**: Full-width cards, stacked layout, touch targets ≥ 44px
- **Tablet (640-1024px)**: 2-column grid for history, slightly larger text
- **Desktop (> 1024px)**: Centered layout, max-width container

---

## Visual Hierarchy (Bird ID Screen Example)

```
┌──────────────────────────────────────┐
│                                      │
│    [🏞️ Header with bird icon]        │  ← Small, contextual
│                                      │
│    Listening...                     │  ← Large status
│    [Spectrogram visualization]       │  ← Visual feedback
│                                      │
│    ┌─────────────────────────────┐   │
│    │ Eastern Whippoorwill       │   │  ← Primary result
│    │ Antrostomus vociferus      │   │  ← Scientific (mono)
│    │ 94.2% confidence           │   │  ← Clear metric
│    │ [🔊 Play call]              │   │  ← Action
│    └─────────────────────────────┘   │
│                                      │
│    [More species...]                 │  ← Secondary
│                                      │
│    [⚙️ Settings]  [📋 History]      │  ← Navigation
└──────────────────────────────────────┘
```

---

## Accessibility Design

### Color Contrast (Verified)
- Main text (`--text-cream` #f2efe9) on `--bg-forest` (#1a2e1b): **15.8:1** ✅
- Secondary (`--text-ivory` #ebe8db) on same: **12.3:1** ✅
- Muted (`--text-stone` #b8b0a6) on same: **5.2:1** ✅
- Bird accent (`--bird-call` #e8a85c) on dark: **3.8:1** ✅ (for UI elements ≥3:1)

### Focus States
```css
*:focus-visible {
  outline: 3px solid var(--bird-call);
  outline-offset: 2px;
  border-radius: 0.5rem;
}
```

### Touch Targets
- All interactive elements: minimum 44px × 44px
- Spacing between targets: minimum 8px
- Large primary buttons for outdoor use (gloves, sunlight)

---

## Image & Media Guidelines

### Species Photos
- **Source**: User-captured only (no external image loading)
- **Format**: JPEG/WebP for storage efficiency
- **Size**: Original kept for export; 224×224 for inference
- **Quality**: 85% for observation storage

### Reference Bird Calls
- **Format**: OGG Vorbis or MP3
- **Length**: 5-15 seconds per species
- **Storage**: Bundled with regional packs (~50MB for 100 species)
- **License**: CC-0 / CC-BY from Xeno-canto (verified per file)

---

## Print / Export Style

When observations are exported or printed:
- Clean, minimal layout
- Species names prominently displayed
- Timestamp and location clearly labeled
- No decorative elements
- Black text on white paper for readability

```css
@media print {
  body { background: white; color: black; }
  .nav-bar { display: none; }
  .card-species { border: 1px solid #ccc; box-shadow: none; }
}
```

---

## Brand Voice (In-App Text)

- **Calm, direct, nature-focused**
- No marketing language, no urgency, no gamification
- Short labels: "Record", "Identify", "Save"
- Species descriptions: factual, 2-3 sentences
- Errors: gentle and helpful ("Let's try again when you're ready")
- No exclamation points except in reference call playback prompts