import { Download, Trash2, CheckCircle2 } from 'lucide-react';
import { ModelInfo } from '../types';
import { DownloadProgress } from './DownloadProgress';

export interface ModelCardProps {
  model: ModelInfo;
  progress: number;
  downloading: boolean;
  installed: boolean;
  error: string | null;
  onDownload: (url: string, id: string, version: string, sizeBytes: number) => Promise<void>;
  onRemove?: (id: string) => Promise<void>;
}

export function ModelCard({ model, progress, downloading, installed, error, onDownload, onRemove }: ModelCardProps) {
  const handleDownload = () => {
    onDownload(model.url, model.id, model.version, model.sizeBytes);
  };

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm" aria-label={`Model ${model.name}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--text)]">{model.name}</h3>
          <p className="text-xs text-[var(--text-muted)]">{model.region ? `Region: ${model.region}` : 'Global'} • v{model.version}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{model.license}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-medium text-[var(--text-muted)]">{(model.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
          {installed && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" aria-label="Installed" />}
        </div>
      </div>

      <div className="mt-4">
        <DownloadProgress progress={progress} downloading={downloading} installed={installed} error={error} />
      </div>

      <div className="mt-4 flex gap-2">
        {!installed ? (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--primary)] text-white hover:bg-[#145a1a] disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            aria-label={`Download ${model.name}`}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Download
          </button>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--primary-light)] text-[var(--primary)]">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Installed
            </span>
            {onRemove && (
              <button
                onClick={() => onRemove(model.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                aria-label={`Remove ${model.name}`}
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Remove
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
