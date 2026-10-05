import { Suspense, lazy } from 'react';
import { Layout } from '../shared/components/Layout';

const BirdIdPage = lazy(() => import('../features/bird-id/BirdIdPage').then((m) => ({ default: m.BirdIdPage })));
const PhotoIdPage = lazy(() => import('../features/photo-id/PhotoIdPage').then((m) => ({ default: m.PhotoIdPage })));
const HistoryPage = lazy(() => import('../features/history/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const ModelManagerPage = lazy(() => import('../features/model-manager/ModelManagerPage').then((m) => ({ default: m.ModelManagerPage })));

export function App() {
  return (
    <Layout>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div id="main-content">
        <section id="bird" aria-label="Bird identification">
          <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading bird identification">Loading bird identification...</div>}>
            <BirdIdPage />
          </Suspense>
        </section>
        <section id="photo" aria-label="Photo identification">
          <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading photo identification">Loading photo identification...</div>}>
            <PhotoIdPage />
          </Suspense>
        </section>
        <section id="history" aria-label="Observation history">
          <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading history">Loading history...</div>}>
            <HistoryPage />
          </Suspense>
        </section>
        <section id="models" aria-label="Model manager">
          <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading model manager">Loading model manager...</div>}>
            <ModelManagerPage />
          </Suspense>
        </section>
      </div>
    </Layout>
  );
}
