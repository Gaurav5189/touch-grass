# Project Index & Map

## Active State
- **Current Phase:** Phase 1 (Bird Call Identification) — mock/stub pipeline complete; real ONNX pipeline pending
- **Current Task:** Restore `onnxruntime-web` chunk + connect real audio → spectrogram → inference
- **Deployment:** `npm run build` passes; Cloudflare Pages deploys (WASM excluded from `manualChunks` for Phase 1 mock)

## Completed Milestones
- Phase 0: PWA skeleton, ThemeProvider, IndexedDB wrapper, CI workflow ✅
- Phase 1 Mock: `AudioRecorder` (48kHz, 3s), `BirdResults` UI, `RegionFilter`, `BirdErrorBoundary`, `useModelDownload` stub, `computeMelSpectrogram` stub ✅
- CodeRabbit fixes: `BirdIdPage.tsx` results reset + `isStub` label ✅
- Cloudflare 25MB WASM fix (`vite.config.ts` `manualChunks` updated) ✅
- Master prompt: `.agents/MASTER_PROMPT.md` ✅

## Doc Map
- **`RULES.md`**: Code formatting, framework rules, strict constraints. (path: DOCS/)
- **`PRD.md`**: Product features, user flows, acceptance criteria. (DOCS/)
- **`ARCHITECTURE.md`**: Database schema, API endpoints, folder structure, system flow. (DOCS/)
- **`DESIGN.md`**: UI component rules, color palettes, visual tokens, layout specs. (DOCS/)
- **`PHASES.md`**: Roadmap breakdown, current phase deliverables, completed milestones. (DOCS/)
- **`MEMORY.md`**: Architectural decisions, past bugs, lessons learned. (.agents/)
- **`MASTER_PROMPT.md`**: Master session prompt — project identity, fixes, blockers, next actions. (.agents/)
- **`review-plan.md`**: CodeRabbit review findings + fix plan. (DOCS/)

## Retrieval Guidelines
1. Working on UI/Layout? -> Read `DESIGN.md`.
2. Modifying DB/API/Endpoints? -> Read relevant sections in `ARCHITECTURE.md`.
3. Updating roadmap or status? -> Check `PHASES.md` and `.agents/MASTER_PROMPT.md`.
4. Stuck on an edge-case bug? -> Grep `MEMORY.md` and `DOCS/review-plan.md`.
5. Next session context? -> Read `.agents/MASTER_PROMPT.md` first.
