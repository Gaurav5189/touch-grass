# DEV.to Submission Article Draft — Touch Grass

**Title**: Touch Grass — A Local-First PWA for Offline Bird, Plant & Insect Identification with Open AI

**Tags**: `#devchallenge` `#hacktoberfest` `#ai` `#opensource` `#pwa` `#offline` `#privacy`

---

## Project Overview & Motivation

I built **Touch Grass** because nature identification shouldn't require a server, an account, or a constant internet connection. Most identification apps send your audio and images to cloud APIs — touching grass shouldn't mean touching a data center.

Touch Grass is a Progressive Web App that runs open-weight AI models (BirdNET-ONNX, MobileNetV3) entirely in the browser. After the initial model download, it works 100% offline. No tracking, no accounts, no data leaves your device.

> **Philosophy**: Identify quickly, then put the phone away and enjoy the outdoors.

---

## Architecture

- **Frontend**: React 18 + TypeScript + Vite 5 + Tailwind CSS
- **PWA / Offline**: `vite-plugin-pwa` + Workbox 7 (service worker precaches app shell)
- **ML Runtime**: ONNX Runtime Web (WebGPU preferred → WASM fallback → TensorFlow.js fallback)
- **Storage**: IndexedDB (`idb` 8.0) for observations and model cache; Cache API for assets
- **Worker**: Dedicated Web Worker (`inference.worker.ts`) for non-blocking inference

### Data Flow

```
Audio / Image → Preprocessing (Web Audio / Canvas) → ONNX Runtime Web (Worker) → Results UI → Auto-save to IndexedDB
```

---

## Open-Source AI Emphasis

- **BirdNET-ONNX**: Quantized INT8 model (~20MB), 3000+ species, Apache-2.0 license (`https://github.com/kahst/BirdNET-ONNX`)
- **Plant / Insect Model**: MobileNetV3 + custom iNaturalist head (~5MB), fine-tuned on public iNaturalist 2021 data (Apache-2.0 / CC-BY)
- All model sources and licenses documented in `DOCS/RULES.md`
- No proprietary or GPL models included

---

## Offline & Privacy Benefits

- **Zero server requests for inference** — the model runs in a Web Worker inside your browser.
- **Optional GPS only with explicit consent** — opt-in, not opt-out.
- **No analytics, no telemetry, no cookies beyond the PWA service worker.**
- **Data export is user-initiated and local-only** — CSV, JSON, or iNaturalist format.

---

## Model Swap Demonstration

The app supports custom ONNX model uploads through the Model Manager. Users can download regional bird packs (e.g., North America East — 8 MB, 400 species) or upload their own validated ONNX files. The inference worker dynamically loads the selected model URL, making model swapping a first-class feature.

---

## Live Demo & Source

- **Live Demo**: https://gavout-source.github.io/touch-grass
- **GitHub Repo**: https://github.com/gavout-source/touch-grass
- **License**: MIT / Apache-2.0
- **Build**: `npm install && npm run build`

---

## What I'm Looking For

Feedback on the PWA install flow, model download UX, and accessibility (WCAG AA target). If you test it on iOS Safari, I'd especially love to hear about WebGPU vs WASM performance.

---

*Built for Hacktoberfest 2026 — Week 1 Challenge (`#hf26challenge`).*
