import { useState } from 'react';
import { BirdResults } from './BirdResults';
import { RegionFilter } from './RegionFilter';
import { AudioRecorder } from './AudioRecorder';
import { BirdErrorBoundary } from './BirdErrorBoundary';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { runInference, BirdPrediction } from '../utils/inference';
import { useModelDownload } from '../../model-manager/hooks/useModelDownload';

export function BirdIdPage() {
  const [region, setRegion] = useState('global');
  const [results, setResults] = useState<BirdPrediction[] | null>(null);
  const [isInferring, setIsInferring] = useState(false);

  const { start, stop, reset, isRecording, chunks, error, permission } = useAudioRecorder();
  const { progress, downloading, installed, startDownload } = useModelDownload();

  const handleRecordComplete = async () => {
    if (chunks.length === 0) return;
    setIsInferring(true);
    // In real pipeline: decode audio → mel spectrogram → inference
    // Here we use mock inference
    try {
      const predictions = await runInference([]);
      setResults(predictions);
    } finally {
      setIsInferring(false);
    }
  };

  return (
    <BirdErrorBoundary>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold">Bird Call Identification</h2>

        {!installed && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Download BirdNET Model (~20MB)</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Required for offline identification.</p>
            <button
              onClick={startDownload}
              disabled={downloading}
              className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/90 disabled:opacity-50"
            >
              {downloading ? `Downloading ${progress}%` : 'Download Model'}
            </button>
          </div>
        )}

        <RegionFilter selected={region} onSelect={setRegion} />

        <AudioRecorder />

        {permission === 'denied' && error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-900 text-sm" role="alert">
            <strong>Microphone access denied.</strong> Please allow microphone access in your browser settings to record bird calls.
          </div>
        )}

        {isRecording && (
          <div className="rounded-2xl border border-[var(--primary)] bg-[var(--primary-light)] p-4 text-center animate-pulse">
            <p className="text-sm font-medium">Recording 3-second sample...</p>
          </div>
        )}

        {results && <BirdResults predictions={results} region={region} />}

        {isInferring && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <div className="h-2 w-48 bg-[var(--border)] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-3">Analyzing audio with BirdNET...</p>
          </div>
        )}
      </div>
    </BirdErrorBoundary>
  );
}
