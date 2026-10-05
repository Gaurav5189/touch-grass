# PRD: Touch Grass - Local-First Nature Identification PWA

## Project Overview
A Progressive Web App that helps people identify birds, plants, and insects in nature using open-weight AI models running entirely on-device. Works offline, keeps all data local, and makes the screen the shortest part of the outdoor experience.

## Target Users
- **Primary**: Nature enthusiasts, birders, hikers, gardeners, outdoor educators
- **Secondary**: Families exploring nature with kids, citizen scientists, students
- **Constraints**: Users often have poor/no cell signal on trails; privacy-conscious; want simple, fast identification without accounts or subscriptions

## Core Features

### 1. Bird Call Identification
- Record 3-second audio clips via microphone
- Real-time inference using BirdNET-ONNX (~20MB quantized)
- Display top-3 species matches with confidence scores
- Play reference calls for verification
- Regional species filtering
- Works completely offline after model download

### 2. Plant & Insect Photo Identification
- Capture photos via camera or import from gallery
- Inference using MobileNetV3 + custom head (~5MB ONNX)
- Display top matches with confidence, descriptions, similar species
- Optional GPS tagging (privacy-first, opt-in)
- Works completely offline after model download

### 3. Observation History
- Automatic save of all identifications (type, species, confidence, timestamp, location?, media)
- Filterable list view (by date, type, species)
- Detail view with map, notes, export
- Export to CSV, JSON, iNaturalist format
- Local full-text search

### 4. Model Management
- View installed models with sizes
- Download regional model packs (smaller, relevant species)
- Check for model updates
- Load custom ONNX models (swap/bring your own)
- Choose inference backend (WebGPU/WASM)

### 5. Settings & Accessibility
- Light/Dark/Auto theme
- Confidence threshold slider
- Auto-save toggle
- Inference backend preference
- WCAG AA compliance

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Offline capability | 100% after initial model download |
| Inference latency (bird) | <3 seconds on modern phone |
| Inference latency (photo) | <2 seconds on modern phone |
| App shell load time | <2 seconds on 3G |
| Bundle size (gzipped) | <500KB |
| PWA installability | Chrome, Safari, Firefox, Edge |
| Data privacy | Zero data leaves device |
| Model license | Apache-2.0 / MIT / CC-BY only |

## Success Metrics
- User identifies species and puts phone away within 10 seconds
- Works on 5-year-old phones (iPhone 12 / Android 10+)
- No internet required for core functionality
- User can swap models without technical knowledge