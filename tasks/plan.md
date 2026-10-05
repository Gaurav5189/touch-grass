# Implementation Plan: Touch Grass - Local-First Nature Identification PWA

## Overview
Build a Progressive Web App (PWA) that helps people identify birds, plants, and insects in nature using open-weight AI models running entirely locally on device. The app works offline (no internet required), keeps all data on the user's device, and makes the screen the shortest part of the experience—identify a bird call or plant photo in seconds, then put the phone away and enjoy nature.

## Core Philosophy
- **Local-first**: All inference runs on-device using WebAssembly/WebGPU
- **Privacy by default**: No data leaves the device, no accounts, no tracking
- **Open innovation**: Uses open-weight models (ONNX format) that users can swap/update
- **Offline-capable**: Works on trails with zero signal
- **Fast**: Identification in <3 seconds so users get back to nature

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **PWA + Service Worker** | Installable, works offline, native-like experience |
| **ONNX Runtime Web** | Runs open-weight models in browser via WASM/WebGPU |
| **TensorFlow.js / MediaPipe** | Fallback for lighter models, broader device support |
| **IndexedDB** | Local storage for observations, model cache, user data |
| **Web Audio API** | Real-time bird call recording and processing |
| **Camera API** | Photo capture for plant/insect identification |
| **React + TypeScript + Vite** | Modern, fast dev experience, small bundle |
| **Tailwind CSS** | Rapid styling, small production bundle |
| **Workbox** | Service worker generation for offline support |

## Model Strategy

### Bird Call Identification
- **Primary**: BirdNET-ONNX (quantized, ~20MB) - 3000+ species
- **Fallback**: Custom lightweight model for common regional birds
- **Input**: 3-second audio chunks at 48kHz → mel spectrogram

### Plant/Insect Photo Identification
- **Primary**: MobileNetV3 + custom head (ONNX, ~5MB) - fine-tuned on iNaturalist subset
- **Fallback**: EfficientNet-Lite (TensorFlow.js)
- **Input**: 224x224 RGB image

### Model Management
- Models downloaded on first use (with progress), cached in IndexedDB
- User can update/swap models via settings
- Regional model packs for smaller downloads

## Task List

### Phase 1: Foundation & Project Setup
- [ ] Task 1: Initialize React + TypeScript + Vite project with PWA configuration
- [ ] Task 2: Configure Tailwind CSS, ESLint, Prettier, and TypeScript strict mode
- [ ] Task 3: Set up Workbox service worker for offline-first caching
- [ ] Task 4: Create IndexedDB wrapper for local data storage (observations, models, settings)
- [ ] Task 5: Build core UI layout: bottom nav, identification modes, settings
- [ ] Task 6: Implement theme system (light/dark/auto) with CSS variables

**Checkpoint: Foundation**
- [ ] `npm run build` succeeds
- [ ] PWA installs on mobile/desktop
- [ ] Service worker caches app shell
- [ ] IndexedDB reads/writes work

### Phase 2: Bird Call Identification
- [ ] Task 7: Integrate ONNX Runtime Web with WebGPU/WASM backend
- [ ] Task 8: Implement audio recording with Web Audio API (3s chunks, 48kHz)
- [ ] Task 9: Build mel spectrogram preprocessing pipeline
- [ ] Task 10: Download and cache BirdNET-ONNX model (~20MB) with progress UI
- [ ] Task 11: Implement inference pipeline: audio → spectrogram → model → top-k results
- [ ] Task 12: Create bird results UI with species info, confidence, play reference call
- [ ] Task 13: Add regional filtering and common species quick-access

**Checkpoint: Bird ID Working**
- [ ] Records audio, runs inference, shows results in <3s on modern phone
- [ ] Works offline after model download
- [ ] Results include species name, confidence, description

### Phase 3: Plant/Insect Photo Identification
- [ ] Task 14: Implement camera capture with Camera API (photo + gallery import)
- [ ] Task 15: Build image preprocessing (resize 224x224, normalize)
- [ ] Task 16: Download and cache plant/insect ONNX model (~5MB)
- [ ] Task 17: Implement photo inference pipeline
- [ ] Task 18: Create photo results UI with species info, confidence, similar species
- [ ] Task 18b: Add GPS location tagging (optional, privacy-first)

**Checkpoint: Photo ID Working**
- [ ] Captures photo, runs inference, shows results in <2s
- [ ] Works offline after model download
- [ ] Handles both camera and gallery images

### Phase 4: Observations & History
- [ ] Task 19: Create observation record schema (type, species, confidence, location?, timestamp, media)
- [ ] Task 20: Build observation list view with filters (date, type, species)
- [ ] Task 21: Implement observation detail view with map, notes, export
- [ ] Task 22: Add export functionality (CSV, JSON, iNaturalist format)
- [ ] Task 23: Implement local search across observations

**Checkpoint: History Complete**
- [ ] Saves observations automatically after identification
- [ ] List/view/search/export all work offline

### Phase 5: Model Management & Settings
- [ ] Task 24: Build model manager UI (view installed, check updates, delete)
- [ ] Task 25: Implement regional model packs (download only relevant species)
- [ ] Task 26: Add model swapping (user can load custom ONNX models)
- [ ] Task 27: Settings: inference backend (WASM/WebGPU), confidence threshold, auto-save
- [ ] Task 28: Add "About" screen with licenses, credits, open-source links

**Checkpoint: Settings Complete**
- [ ] User can manage models without internet (after initial download)
- [ ] Custom ONNX models load and run

### Phase 6: Polish & Launch Prep
- [ ] Task 29: Accessibility audit (WCAG AA): contrast, labels, focus, screen readers
- [ ] Task 30: Performance optimization: bundle size, model load time, inference speed
- [ ] Task 31: Test on target devices: iOS Safari, Android Chrome, desktop
- [ ] Task 32: Create app icons, splash screens, manifest.json
- [ ] Task 33: Write comprehensive README with architecture, model sources, build instructions
- [ ] Task 34: Create DEV.to submission article with demo video/GIFs
- [ ] Task 35: Package for distribution (GitHub Pages, Vercel, or static hosting)

**Checkpoint: Launch Ready**
- [ ] Lighthouse PWA score >90
- [ ] Works on 5+ device/browser combos
- [ ] Article drafted and ready to publish

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Model too large for mobile download | High | Quantized models, regional packs, progressive download |
| WebGPU not available on iOS Safari | High | WASM fallback, TensorFlow.js fallback |
| Inference too slow on older phones | Medium | Model quantization, Web Workers, smaller input |
| Audio permission denied | Medium | Clear permission rationale, graceful fallback |
| Camera permission denied | Medium | Gallery import alternative |
| IndexedDB quota exceeded | Low | Cleanup old observations, model cache management |
| Model license issues | High | Use only Apache-2.0/MIT/CC-BY models, verify licenses |

## Open Questions
1. **Which regional bird packs to prioritize?** - Need user location or manual selection
2. **Reference bird calls** - Need open-licensed audio clips for result playback
3. **iNaturalist export format** - Verify exact format for compatibility
4. **Model update mechanism** - How to notify users of new model versions?
5. **Testing devices** - Need access to iOS/Android for real-device testing

## Success Criteria for Challenge
- ✅ Built with open-source AI at its core (ONNX Runtime, open-weight models)
- ✅ Runs on laptop/phone with no internet (after model download)
- ✅ Keeps data off servers (local-only, no accounts)
- ✅ Lets users swap models (custom ONNX support)
- ✅ Costs nothing to run (no API keys, no cloud)
- ✅ Gets people outside: birding, plant ID, insect spotting
- ✅ Screen time minimized: identify → put away → enjoy nature