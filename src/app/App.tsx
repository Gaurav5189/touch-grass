import { Layout } from '../shared/components/Layout';
import { BirdIdPage } from '../features/bird-id/BirdIdPage';

export function App() {
  return (
    <Layout>
      <section id="bird" aria-label="Bird identification">
        <BirdIdPage />
      </section>
      <section id="photo" className="max-w-3xl mx-auto px-4 py-8" aria-label="Photo identification">
        <h2 className="text-2xl font-bold mb-4">Plant & Insect ID</h2>
        <p className="text-[var(--text-muted)]">Capture or import a photo for local AI identification.</p>
      </section>
      <section id="history" className="max-w-3xl mx-auto px-4 py-8" aria-label="Observation history">
        <h2 className="text-2xl font-bold mb-4">History</h2>
        <p className="text-[var(--text-muted)]">Your observations are saved locally. Nothing leaves your device.</p>
      </section>
    </Layout>
  );
}
