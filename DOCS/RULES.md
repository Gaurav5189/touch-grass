# RULES: Touch Grass Development Guidelines

## Approved Libraries & Tools

### Core Dependencies (Production)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "onnxruntime-web": "^1.17.0",
  "@tensorflow/tfjs": "^4.18.0",
  "idb": "^8.0.0",
  "workbox-window": "^7.0.0"
}
```

### Development Dependencies
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "vite-plugin-pwa": "^0.17.0",
  "typescript": "^5.3.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "eslint": "^8.56.0",
  "@typescript-eslint/eslint-plugin": "^6.19.0",
  "@typescript-eslint/parser": "^6.19.0",
  "prettier": "^3.2.0",
  "vitest": "^1.2.0",
  "@playwright/test": "^1.41.0",
  "husky": "^9.0.0",
  "lint-staged": "^15.2.0"
}
```

### UI Utilities (Minimal)
```json
{
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.312.0"
}
```

### Explicitly Forbidden
- ❌ No UI component libraries (MUI, Chakra, Ant Design, shadcn/ui)
- ❌ No state management libraries (Redux, Zustand, Jotai) — use React Context + useReducer
- ❌ No data fetching libraries (React Query, SWR) — no server data
- ❌ No animation libraries (Framer Motion) — use CSS animations
- ❌ No date libraries (date-fns, dayjs) — use native Intl/Date
- ❌ No routing libraries (React Router) — use simple hash routing or none
- ❌ No heavy utility libraries (lodash, ramda) — use native ES2022+

## Code Style Rules

### TypeScript
- **Strict mode**: Always enabled
- **No `any`**: Use `unknown` with type guards
- **Explicit returns**: For all exported functions
- **Interfaces over types**: For object shapes
- **Discriminated unions**: For state machines

```typescript
// ✅ Good
interface BirdResult {
  species: string;
  confidence: number;
  scientificName: string;
}

type InferenceState = 
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'ready'; model: InferenceSession }
  | { status: 'error'; message: string };

// ❌ Bad
type BirdResult = any;
const state: any = {};
```

### React Patterns
- **Function components only** with hooks
- **Custom hooks** for all reusable logic
- **Colocate** component, hook, types in feature folder
- **Memoize** callbacks passed to memoized children
- **No default exports** — named exports only

```typescript
// ✅ Good - feature-colocated
// features/bird-id/hooks/useBirdInference.ts
export function useBirdInference() { ... }

// ❌ Bad - scattered
// hooks/useBirdInference.ts
export default function useBirdInference() { ... }
```

### File Naming
- Components: `PascalCase.tsx` (`AudioRecorder.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (`useAudioRecorder.ts`)
- Utilities: `camelCase.ts` (`melSpectrogram.ts`)
- Types: `types.ts` or `PascalCase.types.ts`
- Constants: `SCREAMING_SNAKE_CASE.ts` (`MODEL_URLS.ts`)

## Error Handling Guidelines

### 1. Result Types (No Exceptions for Control Flow)
```typescript
// ✅ Good - Result type
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

async function loadModel(url: string): Promise<Result<InferenceSession>> {
  try {
    const session = await ort.InferenceSession.create(url);
    return { ok: true, value: session };
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}

// ❌ Bad - Throwing for expected failures
async function loadModel(url: string) {
  const session = await ort.InferenceSession.create(url); // throws on 404
  return session;
}
```

### 2. Error Boundaries
- Wrap each feature root in ErrorBoundary
- Log to console (dev) + show user-friendly fallback
- Never swallow errors silently

### 3. User-Facing Errors
- **Technical errors** → Generic message + "Report Issue" link
- **Permission denied** → Clear explanation + settings deep link
- **Model load failed** → Retry button + fallback option
- **Storage full** → Cleanup suggestion + manual clear option

### 4. Logging
```typescript
// src/shared/utils/logger.ts
export const logger = {
  debug: (msg: string, data?: unknown) => {
    if (import.meta.env.DEV) console.debug(`[DEBUG] ${msg}`, data);
  },
  info: (msg: string, data?: unknown) => console.info(`[INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[WARN] ${msg}`, data),
  error: (msg: string, error: unknown, data?: unknown) => 
    console.error(`[ERROR] ${msg}`, error, data),
};
```

## AI Boundaries & Constraints

### What AI (LLM) CAN Do in This Project
- ✅ Generate boilerplate code (components, hooks, types)
- ✅ Write unit tests for pure functions
- ✅ Create Tailwind CSS from design specs
- ✅ Write documentation (README, comments)
- ✅ Refactor code for clarity
- ✅ Suggest optimizations for known patterns

### What AI CANNOT Do
- ❌ **Choose model architectures** — BirdNET vs custom is a product decision
- ❌ **Design UX flows** — Requires human judgment on outdoor usage
- ❌ **Select model sources** — License verification is legal responsibility
- ❌ **Decide fallback strategies** — Requires device testing
- ❌ **Set confidence thresholds** — Requires field testing
- ❌ **Approve PRs** — Human review required

### AI Code Review Checklist
When reviewing AI-generated code:
- [ ] No `any` types introduced
- [ ] Error handling uses Result types
- [ ] No forbidden dependencies added
- [ ] Accessibility attributes present
- [ ] Performance implications considered
- [ ] Works offline (no fetch in hot path)
- [ ] Tests cover happy + error paths

## Performance Budgets

| Metric | Budget | Enforcement |
|--------|--------|-------------|
| JS Bundle (gzipped) | < 150 KB | Vite build report |
| CSS Bundle (gzipped) | < 20 KB | Vite build report |
| Initial Model Download | < 25 MB | Model registry config |
| Inference Time (bird) | < 3000 ms | Integration test |
| Inference Time (photo) | < 2000 ms | Integration test |
| Time to Interactive | < 2.5 s | Lighthouse CI |
| Lighthouse PWA Score | > 90 | CI gate |

## Accessibility Requirements (WCAG AA)

### Mandatory
- Semantic HTML (`<button>`, `<nav>`, `<main>`, headings)
- Color contrast ≥ 4.5:1 (text), ≥ 3:1 (UI elements)
- Focus visible on all interactive elements
- ARIA labels for icon-only buttons
- Alt text for all informative images
- Keyboard navigation for all features
- Screen reader announcements for async results

### Testing
- `npm run test:a11y` (axe-core in Vitest)
- Manual NVDA/VoiceOver testing before release

## Security Rules

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'wasm-unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    media-src 'self' blob:;
    connect-src 'self' https://github.com https://huggingface.co;
    worker-src 'self' blob:;
  ">
```

### Data Handling
- No user tracking, analytics, or telemetry
- No external API calls except model downloads
- Model downloads only from approved sources (GitHub Releases, Hugging Face)
- Verify model file hashes after download
- Sanitize any user-imported custom models

## Git Workflow

### Branch Strategy
- `main` — Protected, deployable
- `feature/*` — Short-lived, one feature
- `fix/*` — Bug fixes
- `chore/*` — Maintenance

### Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```
Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `build`

### PR Requirements
- [ ] All CI checks pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Unit tests for new logic
- [ ] Manual test on mobile browser
- [ ] Updated CHANGELOG.md

## Model Licensing Rules

### Approved Licenses
- Apache-2.0
- MIT
- BSD-3-Clause
- CC-BY-4.0 (with attribution)

### Forbidden
- GPL (any version) — viral
- CC-BY-NC — non-commercial restriction
- CC-BY-SA — share-alike
- Custom/proprietary licenses
- No license specified

### Verification Process
1. Check model card / repo for license
2. Download license file
3. Add to `public/models/LICENSES/`
4. Document in `MODEL_REGISTRY.md`

## Testing Standards

### Unit Tests (Vitest)
- Pure functions: 100% coverage target
- Hooks: Test behavior, not implementation
- Components: Render + interaction tests

### Integration Tests
- Model loading → inference → results
- Offline mode simulation
- Storage quota handling

### E2E Tests (Playwright)
- Critical user journeys:
  1. First launch → download model → identify bird
  2. Photo capture → identify plant → save → export
  3. Settings → swap model → verify inference

## What to Avoid (Anti-Patterns)

| Anti-Pattern | Why | Alternative |
|--------------|-----|-------------|
| `useEffect` for data fetching | No server data | Direct async in event handlers |
| Global state for UI | Unnecessary coupling | Local state + Context for true globals |
| Inline styles | Breaks theme system | Tailwind classes |
| Dynamic imports for features | Adds complexity | Code-split at route level only |
| Mutation of props/state | Bugs | Immutable updates |
| `console.log` in production | Noise | Structured logger |
| Large components | Hard to test | Extract sub-components |
| Magic numbers | Unmaintainable | Named constants |
| Commented-out code | Confusion | Git history |

## Definition of Done

A task is complete when:
- [ ] Code compiles (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual test on Chrome + Safari mobile
- [ ] Accessibility check passes
- [ ] Bundle size within budget
- [ ] CHANGELOG.md updated