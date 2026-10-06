import { Play, Volume2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { BirdPrediction } from '../utils/inference';

export interface BirdResultsProps {
  predictions: BirdPrediction[];
  region?: string;
  isStub?: boolean;
}

export function BirdResults({ predictions, region, isStub = false }: BirdResultsProps) {
  const [playingSpecies, setPlayingSpecies] = useState<string | null>(null);

  const playBirdCall = (species: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(3800, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(3600, now + 0.3);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);

      setPlayingSpecies(species);
      setTimeout(() => {
        setPlayingSpecies(null);
        ctx.close().catch(() => {});
      }, 500);
    } catch (e) {
      console.warn('Playback error:', e);
    }
  };

  return (
    <section aria-label="Bird identification results" className="space-y-4">
      {isStub ? (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 font-medium" role="note">
          Offline preview: Download BirdNET in Model Manager for full on-device neural network detection.
        </div>
      ) : (
        <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800 font-medium flex items-center gap-1.5" role="note">
          <CheckCircle2 className="w-4 h-4 text-green-600" aria-hidden="true" />
          <span>On-device AI detection active (BirdNET-ONNX)</span>
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
              onClick={() => playBirdCall(pred.species)}
              className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
              aria-label={`Play reference call for ${pred.species}`}
            >
              {playingSpecies === pred.species ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" aria-hidden="true" /> Playing call...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" /> Reference call
                </>
              )}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
