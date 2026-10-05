import { useState, useCallback } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { GalleryImport } from './components/GalleryImport';
import { PhotoResults } from './components/PhotoResults';
import { PhotoErrorBoundary } from './components/PhotoErrorBoundary';
import { usePhotoInference } from './hooks/usePhotoInference';
import { preprocessImageFromBlob } from './utils/imageProcessing';

export function PhotoIdPage() {
  const { results, isInferring, error: inferenceError, infer, reset } = usePhotoInference();
  const [isStub] = useState(true);

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
            <p className="text-sm text-[var(--text-muted)] mt-3">Analyzing image with MobileNetV3...</p>
          </div>
        )}
      </div>
    </PhotoErrorBoundary>
  );
}
