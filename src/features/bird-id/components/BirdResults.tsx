import { Play } from 'lucide-react';
import { BirdPrediction } from '../utils/inference';

export interface BirdResultsProps {
  predictions: BirdPrediction[];
  region?: string;
  isStub?: boolean;
}

export function BirdResults({ predictions, region, isStub = false }: BirdResultsProps) {
  return (
    <section aria-label="Bird identification results" className="space-y-4">
      {isStub && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 font-medium" role="note">
          Demo results — using stub model (not real audio inference). Real BirdNET-ONNX pipeline coming in Phase 1 milestone.
        </div>
      )}
      {region && <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Region: {region}</p>}
      <div className="grid gap-3">
        {predictions.map((pred) => (
          <article key={pred.species} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">{pred.species}</h3>
                <p className="text-sm italic text-[var(--text-muted)]">{pred.scientificName}</p>
                {pred.commonName && <p className="text-xs text-[var(--text-muted)]">{pred.commonName}</p>}
              </div>
              <span className="text-2xl font-extrabold text-[var(--primary)] whitespace-nowrap">{Math.round(pred.confidence * 100)}%</span>
            </div>
            <div className="mt-3 h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${pred.confidence * 100}%` }} />
            </div>
            <button
              className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
              aria-label={`Play reference call for ${pred.species}`}
            >
              <Play className="w-4 h-4" aria-hidden="true" /> Reference call
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
