import { Camera } from 'lucide-react';

export function CameraCapture() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <Camera className="w-10 h-10 text-[var(--primary)]" aria-hidden="true" />
        <p className="text-sm text-[var(--text-muted)]">Capture or import a photo</p>
        <button
          className="px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label="Open camera"
        >
          Capture
        </button>
      </div>
    </div>
  );
}
