# MEMORY: Touch Grass Development Log

## Project State Tracking

### Current Phase: Phase 0 (Initialization)
**Started**: 2026-10-06
**Target Complete**: 2026-10-06 (1 day)

### Completed
- [x] Project initialized with Vite + React + TypeScript
- [x] PRD.md / ARCHITECTURE.md / RULES.md / PHASES.md / DESIGN.md / tasks/plan.md created
- [x] `package.json` created with approved dependencies (React 18, Vite 5, Tailwind, idb, onnxruntime-web, lucide-react, workbox-window)
- [x] Tailwind CSS configured with custom color tokens (leaf/earth) and design variables
- [x] ESLint (.eslintrc.cjs) + Prettier (.prettierrc) configured; TypeScript strict mode enabled
- [x] `vite-plugin-pwa` configured with Workbox; `public/manifest.json` and service worker generated
- [x] Basic folder structure per ARCHITECTURE.md created (src/app/, src/features/, src/shared/, src/workers/, src/styles/)
- [x] IndexedDB wrapper (`src/shared/utils/idb.ts`) created with observations, modelCache, settings stores
- [x] ThemeProvider (`src/app/providers/ThemeProvider.tsx`) implemented with light/dark/auto + localStorage persistence
- [x] Layout (`Layout`, `Header`, `BottomNav`) components created with semantic HTML and keyboard navigation
- [x] Main entry (`main.tsx`, `App.tsx`) and basic feature stubs (bird-id, photo-id, settings) added
- [x] CI workflow (`.github/workflows/ci.yml`) set up (typecheck, lint, build)
- [x] `npm run build` succeeds; `dist/` contains PWA manifest and service worker
- [x] `.gitignore` and `README.md` created

### In Progress
- [ ] Phase 0 complete — skeleton verified; ready for Phase 1 (Bird Call ID)

### Next Up (Phase 0 Tasks)
1. Initialize Vite + React + TypeScript
2. Configure Tailwind CSS + ESLint + Prettier
3. Set up Workbox service worker (PWA)
4. Create core folder structure
5. Build ThemeProvider + basic layout
6. Deploy skeleton to verify PWA

---

## File/Module Status

| File / Module | Status | Notes |
|--------------|--------|-------|
| `package.json` | Created | All approved deps installed |
| `src/app/App.tsx` | Created | Root layout with bird/photo/history |
| `src/app/main.tsx` | Created | Entry point with ThemeProvider |
| `src/app/providers/ThemeProvider.tsx` | Created | light/dark/auto + persistence |
| `src/features/bird-id/` | Stubbed | AudioRecorder component |
| `src/features/photo-id/` | Stubbed | CameraCapture component |
| `src/features/history/` | Types only | Schema defined |
| `src/features/model-manager/` | Types only | No download UI |
| `src/features/settings/` | Stubbed | Theme toggle |
| `src/shared/components/ui/` | Not created | Planned Phase 1+ |
| `src/shared/utils/idb.ts` | Created | IndexedDB wrapper |
| `src/workers/inference.worker.ts` | Not created | Phase 1 — ONNX |
| `public/manifest.json` | Created | PWA manifest |
| `README.md` | Created | Full docs |

---

## Key Decisions Made

**2026-10-06**
- **Repo name**: `touch-grass` (matches theme, easy to remember)
- **Challenge**: Hacktoberfest 2026 — Week 1: Touch Grass (Oct 5-11)
- **Core approach**: PWA with ONNX Runtime Web for local AI inference
- **No server**: 100% client-side, works offline after initial model download
- **Open-weight**: BirdNET-ONNX (Apache-2.0) for birds; custom MobileNetV3 for plants/insects
- **Privacy-first**: Zero tracking, zero accounts, zero data transmission

---

## Blockers / Open Questions

1. **BirdNET-ONNX model download source** — Confirm GitHub release URL and verify Apache-2.0 license
2. **Reference bird call audio** — Source from Xeno-canto (CC-0 / CC-BY), verify per-species
3. **Custom plant model weights** — Confirm training completed and ONNX export successful
4. **iOS Safari testing** — Need access to iPhone for real-device WebGPU/WASM verification
5. **Performance budget verification** — Measure actual bundle and inference times on target devices

---

## Notes for Next Session

1. Start Phase 0 immediately (Vite init + basic structure)
2. Set up CI early (GitHub Actions) — prevents regression
3. Test PWA install flow on Android Chrome as first verification
4. Create `tasks/plan.md` updates as Phase 0 tasks complete
5. Keep `MEMORY.md` updated daily — it's the only persistent state between sessions

---

*Last updated: 2026-10-06*  
*Phase: Planning Complete / Ready for Phase 0 Implementation*
