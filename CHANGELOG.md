# Changelog

## v0.0.1 — Launch & Submission (2026-10-06)

### Added
- Final production build passes (`npm run build`).
- PWA manifest and service worker verified (`dist/`, `registerSW.js`).
- README.md updated with Launch & Demo section, PWA install instructions.
- DEV.to submission article draft (`DOCS/dev-article.md`).
- CHANGELOG.md created.
- Demo video/GIF description placeholder (`DOCS/DEMO.md`).

### Fixed
- TypeScript errors in `BirdIdPage.tsx` (OfflineAudioContext `length` property) and `inference.worker.ts` (module declaration `onnxruntime-web.d.ts`).
- Build passes cleanly; PWA assets generated.

### Submission
- Phase 6 complete: build verified, docs updated, article drafted, PWA install flow documented, `.agents/MEMORY.md` updated.
- Challenge tags: `#devchallenge` `#hacktoberfest` `#ai` `#opensource`

---

## v0.0.0 — Foundation (2026-10-06)

### Added
- Vite + React + TypeScript skeleton.
- Tailwind CSS with custom design tokens.
- PWA plugin (`vite-plugin-pwa`) + Workbox service worker.
- IndexedDB wrapper (`idb`), ThemeProvider, Layout components.
- Bird-ID feature stub (`AudioRecorder`, `BirdResults`, `RegionFilter`).
- CI workflow (`.github/workflows/ci.yml`).
- `README.md`, `DOCS/ARCHITECTURE.md`, `DOCS/PHASES.md`, `.agents/MEMORY.md`.
