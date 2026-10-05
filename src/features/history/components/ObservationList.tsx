import { Trash2 } from 'lucide-react';
import { Observation } from '../types';

export interface ObservationListProps {
  observations: Observation[];
  onSelect: (o: Observation) => void;
  onDelete?: (id: string) => void;
}

export function ObservationList({ observations, onSelect, onDelete }: ObservationListProps) {
  return (
    <div className="space-y-3" aria-label="Observation list">
      {observations.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-8">No observations found.</p>
      ) : (
        observations.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o)}
            className="w-full text-left rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            aria-label={`Observation of ${o.species} on ${new Date(o.timestamp).toLocaleString()}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--text)]">{o.species}</h3>
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-semibold">
                    {o.type}
                  </span>
                </div>
                <p className="text-sm italic text-[var(--text-muted)]">{o.scientificName}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{new Date(o.timestamp).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[var(--primary)] whitespace-nowrap">{Math.round(o.confidence * 100)}%</span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${o.confidence * 100}%` }} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              {o.media && (
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{o.media.type}</span>
              )}
              {o.notes && <span className="text-xs text-[var(--text-muted)] truncate max-w-[12rem]">{o.notes}</span>}
            </div>
            <div className="mt-2 flex justify-between items-center">
              {o.modelVersion && <span className="text-[10px] text-[var(--text-muted)]">v{o.modelVersion}</span>}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(o.id);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1 py-0.5"
                  aria-label={`Delete observation of ${o.species}`}
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" /> Delete
                </button>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  );
}
