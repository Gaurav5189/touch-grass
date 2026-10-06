import { useState } from 'react';
import { BirdResults } from './components/BirdResults';
import { RegionFilter } from './components/RegionFilter';
import { AudioRecorder } from './components/AudioRecorder';
import { BirdErrorBoundary } from './components/BirdErrorBoundary';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { runInference, BirdPrediction } from './utils/inference';
import { computeMelSpectrogram } from './utils/spectrogram';
import { useModelDownload } from '../model-manager/hooks/useModelDownload';
import { useObservations } from '../history/hooks/useObservations';

export function BirdIdPage() {
  const [region, setRegion] = useState('global');
  const [results, setResults] = useState<BirdPrediction[] | null>(null);
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceError, setInferenceError] = useState<string | null>(null);

  const { start, stop, isRecording, chunks, error: recorderError, permission } = useAudioRecorder();
  const { progress, downloading, installed, error: downloadError, startDownload } = useModelDownload('birdnet-v1');
  const { addObservation } = useObservations();

  const handleStart = () => {
    setResults(null);
    setInferenceError(null);
    start();
  };

  const handleRecordComplete = async () => {
    if (chunks.length === 0) return;
    setIsInferring(true);
    setInferenceError(null);
    try {
      // Decode audio chunks via OfflineAudioContext
      const audioBuffers: AudioBuffer[] = [];
      for (const chunk of chunks) {
        try {
          const arrayBuffer = await chunk.blob.arrayBuffer();
          const audioCtx = new OfflineAudioContext(1, 48000 * 3, 48000);
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          audioBuffers.push(audioBuffer);
        } catch (decodeErr) {
          console.warn('Audio chunk decode warning:', decodeErr);
        }
      }
      const combinedBuffer =
        audioBuffers[0] || new OfflineAudioContext(1, 48000, 48000).createBuffer(1, 48000, 48000);

      const spectrogramFrames = await computeMelSpectrogram(combinedBuffer, 48000);
      const predictions = await runInference(spectrogramFrames);
      setResults(predictions);
      // Auto-save top prediction
      if (predictions.length > 0) {
        const top = predictions[0];
        try {
          await addObservation({
            type: 'bird',
            species: top.species,
            scientificName: top.scientificName,
            confidence: top.confidence,
            timestamp: Date.now(),
            modelVersion: installed ? 'birdnet-onnx-v1' : 'birdnet-stub-v1',
          });
        } catch (e) {
          console.error('Auto-save failed:', e);
        }
      }
    } catch (e) {
      console.error('Audio processing error:', e);
      setInferenceError(e instanceof Error ? e.message : 'Audio processing failed');
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
            <p className="text-sm text-[var(--text-muted)] mb-3">Required for full offline identification on device.</p>
            <button
              onClick={() => startDownload()}
              disabled={downloading}
              aria-label="Download BirdNET model"
              className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/90 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              {downloading ? `Downloading ${progress}%` : 'Download Model'}
            </button>
            {downloadError && (
              <p className="text-xs text-red-600 mt-2" role="alert">
                Download failed: {downloadError}
              </p>
            )}
          </div>
        )}

        {installed && (
          <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4 flex items-center justify-between text-sm text-green-900">
            <span>BirdNET model installed & ready for offline identification.</span>
          </div>
        )}

        <RegionFilter selected={region} onSelect={setRegion} />

        <AudioRecorder isRecording={isRecording} onStart={handleStart} onStop={stop} />

        {chunks.length > 0 && !results && !isInferring && (
          <button
            onClick={handleRecordComplete}
            aria-label="Identify bird from recorded audio"
            className="px-6 py-3 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            Identify Bird
          </button>
        )}

        {permission === 'denied' && recorderError && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-900 text-sm" role="alert" aria-label="Microphone access denied">
            <strong>Microphone access denied.</strong> Please allow microphone access in your browser settings to record bird calls.
          </div>
        )}

        {inferenceError && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-900 text-sm" role="alert">
            <strong>Inference error:</strong> {inferenceError}
          </div>
        )}

        {isRecording && (
          <div className="rounded-2xl border border-[var(--primary)] bg-[var(--primary-light)] p-4 text-center animate-pulse" aria-live="polite" aria-label="Recording in progress">
            <p className="text-sm font-medium">Recording 3-second sample...</p>
          </div>
        )}

        {results && <BirdResults predictions={results} region={region} />}

        {isInferring && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center" aria-live="polite" aria-label="Analyzing bird audio">
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
