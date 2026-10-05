# Touch Grass — Local-First Nature Identification PWA

A Progressive Web App that helps people identify birds, plants, and insects using open-weight AI models running entirely on-device. Works offline, keeps all data local, and minimizes screen time so you can get back to nature.

> **Philosophy:** Identify quickly, then put the phone away and enjoy the outdoors.

---

## Features

- **Bird Call ID** — Record 3-second audio clips, identify species via BirdNET-ONNX (~20MB, quantized, 3000+ species), all on-device.
- **Plant & Insect Photo ID** — Capture or import a photo, get top-5 matches from a MobileNetV3 model (~5MB), with descriptions and similar species.
- **Fully Offline** — After initial model downloads, no internet required. Service worker caches the app shell; IndexedDB stores observations and model cache.
- **Private by Default** — No accounts, no tracking, no server requests for inference. Optional GPS tagging is opt-in only.
- **Observation History** — Auto-save after every identification. Filter, search, and export observations (CSV, JSON, iNaturalist format) without leaving your device.
- **Model Management** — Download regional bird packs, swap in custom ONNX models, and choose inference backend (WebGPU preferred, WASM fallback, TensorFlow.js fallback).
- **Accessible & Fast** — WCAG AA target, <3s bird inference, <2s photo inference.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18.2 + TypeScript 5.3 |
| Build | Vite 5.0 + vite-plugin-pwa |
| Styling | Tailwind CSS 3.4 |
| ML / Inference | ONNX Runtime Web (WebGPU / WASM), TensorFlow.js fallback |
| Storage | IndexedDB (idb 8.0), Cache API |
| Offline | Workbox 7.0 service worker |
| Icons | lucide-react |

---

## Project Structure

```
touch-grass/
├── DOCS/                 # Project docs (ARCHITECTURE, DESIGN, PHASES, etc.)
├── tasks/                # Implementation plans
├── public/               # Static assets, manifest.json, icons, models/
├── src/
│   ├── app/              # App shell, routes, providers
│   ├── features/         # Bird ID, Photo ID, History, Model Manager, Settings
│   ├── shared/           # Components, hooks, utils, types
│   ├── workers/          # Web Workers for inference
│   └── styles/           # Global CSS + variables
├── tests/                # Unit / integration / E2E
└── .github/workflows/    # CI / deploy
```

Read `DOCS/ARCHITECTURE.md` for full folder details and `DOCS/PHASES.md` for the roadmap.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A modern browser with WebGPU or WASM support (Chrome, Firefox, Safari, Edge)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Type Check & Lint

```bash
npm run typecheck
npm run lint
npm run format
```

---

## PWA & Offline

The app is installable on mobile and desktop. The service worker (Workbox) caches the app shell. Models are downloaded on first use and stored in IndexedDB, so identification works without a network connection after the initial download.

---

## Model Strategy

- **Birds**: BirdNET-ONNX (quantized INT8, ~20MB, Apache-2.0). Regional packs available to reduce download size.
- **Plants / Insects**: MobileNetV3 + custom iNaturalist head (ONNX, ~5MB, Apache-2.0 / CC-BY).
- **Custom Models**: Users can upload their own ONNX files via the Model Manager.

All model sources and licenses are documented. See `DOCS/RULES.md` for licensing rules.

---

## Accessibility

- Semantic HTML and keyboard navigation throughout.
- Color contrast targets ≥ 4.5:1.
- Focus visible on all interactive elements.
- Screen reader announcements for async identification results.

---

## Security & Privacy

- No analytics, tracking, or telemetry.
- No external API calls except approved model downloads (GitHub Releases, Hugging Face).
- Content Security Policy enforced in `index.html`.
- All user data stays in the browser.

---

## Testing

```bash
npm run test          # Vitest unit tests
npm run test:e2e      # Playwright E2E
```

See `DOCS/RULES.md` for testing standards and coverage targets.

---

## Deployment

Static hosting via GitHub Pages, Vercel, or Netlify. CI pipeline (GitHub Actions) runs typecheck, lint, tests, and build checks.

---

## Roadmap & Phases

| Phase | Focus | Key Deliverable |
|-------|-------|-----------------|
| 0 | Foundation | PWA skeleton, offline shell, CI |
| 1 | Bird Call ID | Audio recording → BirdNET inference |
| 2 | Photo ID | Camera / gallery → plant/insect inference |
| 3 | History & Export | Save, filter, search, export observations |
| 4 | Model & Settings | Download packs, custom ONNX, preferences |
| 5 | Polish & Launch | A11y audit, performance, device testing |
| 6 | Submission | DEV.to article, demo, challenge entry |

Details: `DOCS/PHASES.md`

---

## Launch & Demo

- **Live Demo**: https://gavout-source.github.io/touch-grass (GitHub Pages)
- **Demo Video / GIF**: See `DOCS/DEMO.md` for video script and placeholder assets.
- **PWA Install**: Open in Chrome / Safari → "Add to Home Screen". Service worker caches the app shell; offline identification works after the first model download.

---

## License

MIT / Apache-2.0 — see `LICENSE` file. Open-weight models use Apache-2.0 or MIT licenses; no GPL or proprietary models included.

---

## Contributing

1. Read `DOCS/RULES.md` (coding standards, forbidden libraries, AI boundaries).
2. Read `DOCS/ARCHITECTURE.md` (folder structure, data flow).
3. Create a `feature/*` or `fix/*` branch.
4. Ensure `npm run typecheck`, `npm run lint`, and `npm run test` pass.
5. Update `CHANGELOG.md`.

---

## Related Documents

- `DOCS/INDEX.md` — Project map and retrieval guidelines
- `DOCS/ARCHITECTURE.md` — System design, folder structure, tech choices
- `DOCS/PRD.md` — Product requirements and user flows
- `DOCS/DESIGN.md` — UI components, colors, layout specs
- `DOCS/PHASES.md` — Roadmap, checkpoints, milestones
- `DOCS/MEMORY.md` — Decisions, bugs, lessons (`.agents/`)
- `tasks/plan.md` — Implementation plan with task lists
- `DOCS/RULES.md` — Code style, security, licensing, testing
