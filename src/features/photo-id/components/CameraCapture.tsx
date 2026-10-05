import { useState, useRef, useCallback } from 'react';
import { Camera, CameraOff, Image as ImageIcon } from 'lucide-react';

export interface CameraCaptureProps {
  onCapture?: (blob: Blob) => void;
  facingMode?: 'user' | 'environment';
}

export function CameraCapture({ onCapture, facingMode = 'environment' }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: facingMode } },
      });
      streamRef.current = stream;
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Camera access denied');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setPreviewUrl(URL.createObjectURL(blob));
        onCapture?.(blob);
      }
    }, 'image/jpeg', 0.92);
  }, [onCapture]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
      <div className="flex flex-col items-center gap-2">
        <Camera className="w-10 h-10 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="font-bold text-lg">Camera Capture</h3>
        <p className="text-sm text-[var(--text-muted)]">Use your camera to identify plants and insects.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-900 text-sm" role="alert">
          <strong>Camera error:</strong> {error}
        </div>
      )}

      <div className="relative rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] aspect-video">
        {isActive ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            aria-label="Live camera preview"
          />
        ) : previewUrl ? (
          <img src={previewUrl} alt="Captured preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--bg)]">
            <ImageIcon className="w-12 h-12 text-[var(--text-muted)] opacity-40" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            aria-label="Open camera"
          >
            Open Camera
          </button>
        ) : (
          <>
            <button
              onClick={capturePhoto}
              className="px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Capture photo"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] font-medium hover:bg-[var(--bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Close camera"
            >
              <span className="flex items-center gap-2"><CameraOff className="w-4 h-4" aria-hidden="true" /> Close</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
