import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { Observation } from '../types';
import { exportCSV, exportJSON, exportiNaturalistCSV } from '../utils/exportFormats';

export interface ExportDialogProps {
  observations: Observation[];
  open: boolean;
  onClose: () => void;
}

export function ExportDialog({ observations, open, onClose }: ExportDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!open) return null;

  const handleExport = (format: 'csv' | 'json' | 'inaturalist') => {
    let content = '';
    let mime = '';
    let filename = '';
    switch (format) {
      case 'csv':
        content = exportCSV(observations);
        mime = 'text/csv';
        filename = 'observations.csv';
        break;
      case 'json':
        content = exportJSON(observations);
        mime = 'application/json';
        filename = 'observations.json';
        break;
      case 'inaturalist':
        content = exportiNaturalistCSV(observations);
        mime = 'text/csv';
        filename = 'inaturalist.csv';
        break;
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(format);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Export observations">
      <div className="w-full max-w-md mx-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[var(--text)]">Export Observations</h2>
          <button
            onClick={onClose}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-2 py-1"
            aria-label="Close export dialog"
          >
            Close
          </button>
        </div>
        <p className="text-sm text-[var(--text-muted)]">{observations.length} observation{observations.length !== 1 ? 's' : ''} ready.</p>
        <div className="grid gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface)] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] flex items-center justify-between"
            aria-label="Export as CSV"
          >
            <span>CSV</span>
            <span className="flex items-center gap-1 text-[var(--primary)] text-xs">
              {copied === 'csv' ? <><Check className="w-3 h-3" /> Done</> : <Download className="w-3 h-3" />}
            </span>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface)] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] flex items-center justify-between"
            aria-label="Export as JSON"
          >
            <span>JSON</span>
            <span className="flex items-center gap-1 text-[var(--primary)] text-xs">
              {copied === 'json' ? <><Check className="w-3 h-3" /> Done</> : <Download className="w-3 h-3" />}
            </span>
          </button>
          <button
            onClick={() => handleExport('inaturalist')}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface)] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] flex items-center justify-between"
            aria-label="Export as iNaturalist CSV"
          >
            <span>iNaturalist CSV</span>
            <span className="flex items-center gap-1 text-[var(--primary)] text-xs">
              {copied === 'inaturalist' ? <><Check className="w-3 h-3" /> Done</> : <Download className="w-3 h-3" />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
