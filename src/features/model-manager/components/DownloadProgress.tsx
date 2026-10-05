import { Download } from 'lucide-react';

export interface DownloadProgressProps {
  progress: number;
  downloading: boolean;
  installed: boolean;
  error: string | null;
}

export function DownloadProgress({ progress, downloading, installed, error }: DownloadProgressProps) {
  return (
    <div className="w-full" aria-label="Download progress">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-[var(--text-muted)]">
          {installed ? 'Installed' : downloading ? 'Downloading...' : 'Not downloaded'}
        </span>
        <span className="font-medium text-[var(--primary)]">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Download progress">
        <div
          className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}
      {downloading && (
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Download className="w-3 h-3 animate-bounce" aria-hidden="true" />
          <span>Streaming to IndexedDB...</span>
        </div>
      )}
    </div>
  );
}
