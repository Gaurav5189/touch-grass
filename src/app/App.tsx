import { Suspense, lazy, useState, useEffect } from 'react';
import { Layout } from '../shared/components/Layout';

const BirdIdPage = lazy(() => import('../features/bird-id/BirdIdPage').then((m) => ({ default: m.BirdIdPage })));
const PhotoIdPage = lazy(() => import('../features/photo-id/PhotoIdPage').then((m) => ({ default: m.PhotoIdPage })));
const HistoryPage = lazy(() => import('../features/history/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const ModelManagerPage = lazy(() => import('../features/model-manager/ModelManagerPage').then((m) => ({ default: m.ModelManagerPage })));

export function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'bird';
    const hash = window.location.hash.replace('#', '');
    return ['bird', 'photo', 'history', 'models'].includes(hash) ? hash : 'bird';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['bird', 'photo', 'history', 'models'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <Layout activeTab={activeTab} onSelectTab={setActiveTab}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div id="main-content">
        {activeTab === 'bird' && (
          <section id="bird" aria-label="Bird identification">
            <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading bird identification">Loading bird identification...</div>}>
              <BirdIdPage />
            </Suspense>
          </section>
        )}
        {activeTab === 'photo' && (
          <section id="photo" aria-label="Photo identification">
            <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading photo identification">Loading photo identification...</div>}>
              <PhotoIdPage />
            </Suspense>
          </section>
        )}
        {activeTab === 'history' && (
          <section id="history" aria-label="Observation history">
            <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading history">Loading history...</div>}>
              <HistoryPage />
            </Suspense>
          </section>
        )}
        {activeTab === 'models' && (
          <section id="models" aria-label="Model manager">
            <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8" aria-label="Loading model manager">Loading model manager...</div>}>
              <ModelManagerPage />
            </Suspense>
          </section>
        )}
      </div>
    </Layout>
  );
}
