import { Sparkles, CheckCircle2 } from 'lucide-react';
import { PhotoResult } from '../types';

export interface PhotoResultsProps {
  results: PhotoResult[];
  isStub?: boolean;
}

export function PhotoResults({ results, isStub }: PhotoResultsProps) {
  const topResults = results.slice(0, 5);

  return (
    <section aria-label="Photo identification results" className="space-y-4">
      {isStub ? (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 font-medium" role="note">
          Offline preview: Download MobileNet in Model Manager for full on-device neural network detection.
        </div>
      ) : (
        <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800 font-medium flex items-center gap-1.5" role="note">
          <CheckCircle2 className="w-4 h-4 text-green-600" aria-hidden="true" />
          <span>On-device AI detection active (MobileNetV2 ONNX)</span>
        </div>
      )}

      <div className="grid gap-3">
        {topResults.map((result, index) => (
          <article
            key={`${result.species}-${index}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">{result.species}</h3>
                <p className="text-sm italic text-[var(--text-muted)]">{result.scientificName}</p>
                {result.description && (
                  <p className="text-sm text-[var(--text-muted)] mt-2">{result.description}</p>
                )}
              </div>
              <span className="text-2xl font-extrabold text-[var(--primary)] whitespace-nowrap">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>

            <div className="mt-3 h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] rounded-full"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>

            {result.similar && result.similar.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
                <span className="text-xs text-[var(--text-muted)]">Similar: {result.similar.join(', ')}</span>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
