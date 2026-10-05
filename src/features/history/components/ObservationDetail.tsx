import { ArrowLeft, MapPin, Music, Image, FileText, Info } from 'lucide-react';
import { Observation } from '../types';

export interface ObservationDetailProps {
  observation: Observation;
  onBack: () => void;
}

export function ObservationDetail({ observation, onBack }: ObservationDetailProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm p-6 space-y-4" aria-label="Observation detail">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1 py-0.5"
        aria-label="Back to list"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
      </button>

      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-[var(--text)]">{observation.species}</h2>
        <p className="text-base italic text-[var(--text-muted)]">{observation.scientificName}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-semibold">
            {observation.type}
          </span>
          <span className="text-xs text-[var(--text-muted)]">{new Date(observation.timestamp).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Confidence</p>
          <div className="mt-1 h-3 w-full bg-[var(--bg)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${observation.confidence * 100}%` }} />
          </div>
          <p className="text-right text-sm font-bold text-[var(--primary)] mt-1">{Math.round(observation.confidence * 100)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {observation.location && (
          <div className="rounded-xl bg-[var(--bg)] p-3 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-[var(--text-muted)]">Location</p>
              <p className="text-xs font-medium text-[var(--text)]">{observation.location.lat.toFixed(4)}, {observation.location.lng.toFixed(4)}</p>
              <p className="text-[10px] text-[var(--text-muted)]">Accuracy: {observation.location.accuracy.toFixed(0)}m</p>
            </div>
          </div>
        )}
        <div className="rounded-xl bg-[var(--bg)] p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">Model</p>
            <p className="text-xs font-medium text-[var(--text)]">{observation.modelVersion}</p>
          </div>
        </div>
      </div>

      {observation.media && (
        <div className="rounded-xl bg-[var(--bg)] p-3 flex items-start gap-2">
          {observation.media.type === 'audio' ? <Music className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" aria-hidden="true" /> : <Image className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" aria-hidden="true" />}
          <div>
            <p className="text-xs text-[var(--text-muted)]">Media ({observation.media.type})</p>
            <p className="text-xs font-medium text-[var(--text)]">{observation.media.mimeType}</p>
          </div>
        </div>
      )}

      {observation.notes && (
        <div className="rounded-xl bg-[var(--bg)] p-3 flex items-start gap-2">
          <FileText className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">Notes</p>
            <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{observation.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
