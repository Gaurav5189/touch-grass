import { useCallback, useEffect } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { GalleryImport } from './components/GalleryImport';
import { PhotoResults } from './components/PhotoResults';
import { PhotoErrorBoundary } from './components/PhotoErrorBoundary';
import { usePhotoInference } from './hooks/usePhotoInference';
import { preprocessImageFromBlob } from './utils/imageProcessing';
import { useObservations } from '../history/hooks/useObservations';
import { useModelDownload } from '../model-manager/hooks/useModelDownload';

export function PhotoIdPage() {
  const { results, isInferring, isStub, error: inferenceError, infer, reset } = usePhotoInference();
  const { progress, downloading, installed, error: downloadError, startDownload } = useModelDownload('mobilenet-plants-v1');
  const { addObservation } = useObservations();

  useEffect(() => {
    if (results && results.length > 0) {
      const top = results[0];
      const isInsect =
        top.species.toLowerCase().includes('bee') ||
        top.species.toLowerCase().includes('butterfly') ||
        top.species.toLowerCase().includes('lacewing') ||
        top.species.toLowerCase().includes('beetle') ||
        top.species.toLowerCase().includes('ant');
      addObservation({
        type: isInsect ? 'insect' : 'plant',
        species: top.species,
        scientificName: top.scientificName,
        confidence: top.confidence,
        timestamp: Date.now(),
        modelVersion: isStub ? 'mobilenet-stub' : 'mobilenetv2-onnx',
      }).catch((err) => console.error('Failed to auto-save photo observation:', err));
    }
  }, [results, addObservation, isStub]);

  const handleCapture = useCallback(
    async (blob: Blob) => {
      reset();
      try {
        const tensor = await preprocessImageFromBlob(blob);
        await infer(tensor);
      } catch (e) {
        console.error('Image preprocessing or inference error:', e);
      }
    },
    [infer, reset]
  );

  const handleImport = useCallback(
    async (blob: Blob, _previewUrl: string) => {
      reset();
      try {
        const tensor = await preprocessImageFromBlob(blob);
        await infer(tensor);
      } catch (e) {
        console.error('Image preprocessing or inference error:', e);
      }
    },
    [infer, reset]
  );

  return (
    <PhotoErrorBoundary>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold">Plant & Insect Identification</h2>

        {!installed && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Download MobileNet Model (~4.7MB)</h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">Required for offline neural network identification on device.</p>
            <button
              onClick={() => startDownload('https://media.githubusercontent.com/media/onnx/models/main/validated/vision/classification/mobilenet/model/mobilenetv2-7.onnx', 'mobilenet-plants-v1', '0.9.1', 4956208)}
              disabled={downloading}
              aria-label="Download MobileNet model"
              className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[#145a1a] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
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
            <span>MobileNetV2 neural network installed & active for on-device detection.</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <CameraCapture onCapture={handleCapture} facingMode="environment" />
          <GalleryImport onImport={handleImport} />
        </div>

        {inferenceError && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-900 text-sm" role="alert">
            <strong>Inference error:</strong> {inferenceError}
          </div>
        )}

        {results && <PhotoResults results={results} isStub={isStub} />}

        {isInferring && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <div className="h-2 w-48 bg-[var(--border)] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-3">Analyzing image with MobileNetV2 neural network...</p>
          </div>
        )}
      </div>
    </PhotoErrorBoundary>
  );
}
