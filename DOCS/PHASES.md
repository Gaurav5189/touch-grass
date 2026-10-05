# PHASES: Touch Grass Development Phases

## Phase 0: Project Initialization (Day 0-1)
**Goal**: Runnable PWA skeleton with offline support

### Tasks
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS with design system
- [ ] Set up ESLint, Prettier, TypeScript strict mode
- [ ] Configure vite-plugin-pwa with Workbox
- [ ] Create basic folder structure per ARCHITECTURE.md
- [ ] Add IndexedDB wrapper (idb)
- [ ] Implement ThemeProvider (light/dark/auto)
- [ ] Create Layout, Header, BottomNav components
- [ ] Set up GitHub Actions CI (typecheck, lint, test, build)
- [ ] Deploy to GitHub Pages (verify PWA install)

### Acceptance Criteria
- `npm run dev` starts dev server
- `npm run build` produces working dist/
- PWA installs on mobile/desktop
- Service worker caches app shell
- Theme toggle persists in localStorage
- CI passes on push

---

## Phase 1: Bird Call Identification (Day 1-4)
**Goal**: Record audio → identify bird → show results (offline)

### Tasks
- [ ] Integrate ONNX Runtime Web with WebGPU/WASM detection
- [ ] Create Inference Web Worker wrapper
- [ ] Implement AudioRecorder hook (MediaRecorder API, 3s chunks, 48kHz)
- [ ] Build mel spectrogram pipeline (Web Audio API → OfflineAudioContext)
- [ ] Download & cache BirdNET-ONNX model (~20MB) with progress UI
- [ ] Implement inference pipeline: audio → spectrogram → model → top-k
- [ ] Create BirdResults UI with species cards, confidence, reference audio
- [ ] Add regional species filtering (user selects region)
- [ ] Handle permissions gracefully (mic denied → clear messaging)
- [ ] Add error boundary for bird-id feature

### Models
- **Primary**: BirdNET-ONNX (quantized INT8, 3000+ species)
- **Source**: https://github.com/kahst/BirdNET-ONNX (Apache-2.0)
- **Fallback**: Custom regional model (~5MB, top 100 species)

### Acceptance Criteria
- Records 3s audio on button press
- Shows spectrogram visualization during recording
- Runs inference in <3s on iPhone 12 / Pixel 6
- Displays top-3 species with confidence %
- Plays reference call (bundled audio clips)
- Works 100% offline after model download
- Handles mic permission denial gracefully

---

## Phase 2: Photo Identification (Day 4-7)
**Goal**: Capture/import photo → identify plant/insect → show results

### Tasks
- [ ] Implement CameraCapture component (getUserMedia, facingMode: environment)
- [ ] Add GalleryImport (input type=file, accept=image/*)
- [ ] Build image preprocessing (resize 224x224, normalize, tensor conversion)
- [ ] Download & cache plant/insect ONNX model (~5MB)
- [ ] Implement photo inference pipeline in worker
- [ ] Create PhotoResults UI with top-5 matches, descriptions, similar species
- [ ] Add optional GPS tagging (Geolocation API, opt-in only)
- [ ] Handle camera/gallery permissions gracefully
- [ ] Add error boundary for photo-id feature

### Models
- **Primary**: MobileNetV3-Small + iNaturalist head (ONNX, ~5MB)
- **Source**: Fine-tuned on iNaturalist 2021 subset (plants + insects)
- **License**: Apache-2.0 (model) + CC-BY (training data)
- **Fallback**: TensorFlow.js MobileNet + custom classifier

### Acceptance Criteria
- Camera opens, captures photo, shows preview
- Gallery import works
- Runs inference in <2s on modern phone
- Displays top-5 matches with confidence %
- Shows species description + similar species
- Works 100% offline after model download
- GPS opt-in with clear privacy notice

---

## Phase 3: Observation History & Export (Day 7-9)
**Goal**: Automatic save → browse history → export data

### Tasks
- [ ] Define Observation schema (IndexedDB)
- [ ] Auto-save after every successful identification
- [ ] Build ObservationList with virtual scrolling
- [ ] Add FilterBar (date range, type, species search)
- [ ] Create ObservationDetail view (map, notes, media)
- [ ] Implement ExportDialog (CSV, JSON, iNaturalist CSV)
- [ ] Add local full-text search (Fuse.js or native)
- [ ] Add swipe-to-delete, pull-to-refresh

### Data Schema
```typescript
interface Observation {
  id: string;           // UUID
  type: 'bird' | 'plant' | 'insect';
  species: string;
  scientificName: string;
  confidence: number;   // 0-1
  timestamp: number;    // Date.now()
  location?: {          // Optional, opt-in
    lat: number;
    lng: number;
    accuracy: number;
  };
  media?: {             // Optional, stored as blob
    type: 'audio' | 'image';
    blob: Blob;
    mimeType: string;
  };
  notes?: string;
  modelVersion: string;
}
```

### Acceptance Criteria
- Observations save automatically after ID
- List loads in <500ms with 1000+ entries
- Filters work instantly
- Export produces valid CSV/JSON/iNat format
- Search finds by species, date, location
- Works completely offline

---

## Phase 4: Model Manager & Settings (Day 9-11)
**Goal**: User controls models, backends, preferences

### Tasks
- [ ] Build ModelManager UI (list installed, sizes, versions)
- [ ] Implement regional model packs (download only relevant species)
- [ ] Add model update check (GitHub Releases API)
- [ ] Create CustomModelUploader (drag-drop ONNX, validate)
- [ ] Settings panel: theme, backend (WebGPU/WASM), confidence threshold, auto-save
- [ ] About dialog with licenses, credits, links
- [ ] Model validation (check inputs/outputs match expected)

### Regional Packs (Examples)
| Region | Bird Species | Size |
|--------|-------------|------|
| North America (East) | 400 | 8 MB |
| North America (West) | 350 | 7 MB |
| Europe | 500 | 10 MB |
| Australia | 300 | 6 MB |
| Global (full) | 3000+ | 20 MB |

### Acceptance Criteria
- User sees installed models with sizes
- Can download regional pack with progress
- Can upload custom ONNX model (validated)
- Can switch inference backend
- Settings persist across sessions
- All works offline (except update check)

---

## Phase 5: Polish & Accessibility (Day 11-13)
**Goal**: Production-ready, accessible, performant

### Tasks
- [ ] Accessibility audit (axe-core, manual NVDA/VoiceOver)
- [ ] Fix all WCAG AA violations
- [ ] Performance optimization (bundle splitting, lazy loading)
- [ ] Test on device matrix:
  - iPhone 12 (Safari)
  - iPhone 14 (Safari)
  - Pixel 6 (Chrome)
  - Samsung S22 (Chrome)
  - iPad (Safari)
  - Desktop Chrome/Firefox/Safari/Edge
- [ ] Create app icons (all sizes), splash screens
- [ ] Finalize manifest.json (shortcuts, screenshots)
- [ ] Write comprehensive README
- [ ] Record demo video/GIFs for submission
- [ ] Write DEV.to submission article

### Performance Targets
| Metric | Target |
|--------|--------|
| Lighthouse PWA | > 90 |
| Lighthouse Performance | > 80 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | > 90 |
| JS Bundle (gzipped) | < 150 KB |
| Time to Interactive | < 2.5s |

### Acceptance Criteria
- Zero axe-core violations
- Manual screen reader test passes
- All device tests pass
- Bundle size within budget
- Demo materials ready

---

## Phase 6: Launch & Submission (Day 13-14)
**Goal**: Submit to Hacktoberfest Week 1 Challenge

### Tasks
- [ ] Final production build
- [ ] Deploy to GitHub Pages + custom domain (optional)
- [ ] Verify PWA install flow on fresh device
- [ ] Publish DEV.to article with:
  - Project overview & motivation
  - Architecture diagram
  - Open-source AI emphasis
  - Offline/privacy benefits
  - Model swap demonstration
  - Links to repo, live demo, models
- [ ] Submit to DEV Challenge (tags: #devchallenge #hacktoberfest #ai #opensource)
- [ ] Share on social media with #hf26challenge
- [ ] Respond to community feedback

### Submission Checklist
- [ ] Public GitHub repo with MIT/Apache-2.0 license
- [ ] Live demo URL (HTTPS)
- [ ] README with build/run instructions
- [ ] DEV.to article published
- [ ] Uses open-weight models (documented)
- [ ] Runs offline (verified)
- [ ] No user data leaves device
- [ ] Model swapping demonstrated

---

## Parallelization Opportunities

| Can Run in Parallel | Must Be Sequential |
|---------------------|-------------------|
| Phase 1 & 2 (different features) | Phase 0 before everything |
| Phase 3 & 4 (independent) | Phase 1 before Phase 3 (needs observations) |
| Accessibility audit during Phase 5 | Model downloads before inference tests |
| Device testing during Phase 5 | Deploy after build passes |

---

## Milestone Checkpoints

| Checkpoint | Phase | Criteria |
|------------|-------|----------|
| **M1: PWA Ready** | 0 | Installs, offline shell, CI green |
| **M2: Bird ID Works** | 1 | Records → identifies → results offline |
| **M3: Photo ID Works** | 2 | Captures → identifies → results offline |
| **M4: History Complete** | 3 | Save → list → filter → export |
| **M5: Models Manageable** | 4 | Download, swap, custom upload |
| **M6: Production Ready** | 5 | A11y, perf, device tested |
| **M7: Submitted** | 6 | Article live, challenge entered |

---

## Time Estimates (Solo Developer)

| Phase | Days | Cumulative |
|-------|------|------------|
| 0: Init | 1 | 1 |
| 1: Bird ID | 3 | 4 |
| 2: Photo ID | 3 | 7 |
| 3: History | 2 | 9 |
| 4: Model Manager | 2 | 11 |
| 5: Polish | 2 | 13 |
| 6: Launch | 1 | 14 |

**Total: ~2 weeks** (fits Hacktoberfest Week 1: Oct 5-11)

---

## Risk Buffer

| Risk | Buffer | Mitigation |
|------|--------|------------|
| Model download fails on slow connection | +1 day | Smaller regional packs, resume support |
| iOS Safari WebGPU issues | +1 day | WASM fallback tested early |
| Audio permission UX complexity | +0.5 day | Test permission flows early |
| IndexedDB quota on Safari | +0.5 day | Implement cleanup early |
| License verification delays | +1 day | Pre-verify all models in Phase 0 |