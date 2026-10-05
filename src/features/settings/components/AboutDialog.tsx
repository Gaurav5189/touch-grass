import { useState } from 'react';
import { Info, X, Github, ExternalLink } from 'lucide-react';

export interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  const [showLicenses, setShowLicenses] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="About Touch Grass"
    >
      <div className="relative max-w-md w-full rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label="Close about dialog"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
          <h2 className="text-lg font-bold">About Touch Grass</h2>
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-4">
          Touch Grass is an offline-first PWA for bird call and photo identification using open-weight ONNX models. All inference runs locally on your device.
        </p>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Credits</h3>
          <ul className="text-sm text-[var(--text-muted)] space-y-1">
            <li>• BirdNET-ONNX by <a href="#" className="text-[var(--primary)] hover:underline inline-flex items-center gap-1">Kahst <ExternalLink className="w-3 h-3" aria-hidden="true" /></a></li>
            <li>• MobileNetV3 + iNaturalist head (Apache-2.0)</li>
            <li>• ONNX Runtime Web (MIT)</li>
            <li>• Icons: Lucide</li>
          </ul>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowLicenses(!showLicenses)}
            className="text-sm font-medium text-[var(--primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
            aria-expanded={showLicenses}
          >
            {showLicenses ? 'Hide licenses' : 'Show licenses'}
          </button>
          {showLicenses && (
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--text-muted)] space-y-2">
              <p><strong>Touch Grass</strong> — MIT License</p>
              <p><strong>BirdNET-ONNX</strong> — Apache-2.0</p>
              <p><strong>ONNX Runtime Web</strong> — MIT</p>
              <p><strong>lucide-react</strong> — ISC</p>
            </div>
          )}
        </div>

        <a
          href="#"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--primary)] text-white hover:bg-[#145a1a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <Github className="w-4 h-4" aria-hidden="true" />
          View on GitHub
        </a>
      </div>
    </div>
  );
}
