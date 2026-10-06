import { Leaf, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { SettingsPanel } from '../../features/settings/components/SettingsPanel';

export function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-tight text-[var(--text)]">Touch Grass</h1>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label="Open settings"
        >
          <SettingsIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {showSettings &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Settings modal"
          >
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Settings & Preferences</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-sm px-3 py-1 rounded-full border border-[var(--border)] hover:bg-[var(--bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  aria-label="Close settings"
                >
                  Close
                </button>
              </div>
              <SettingsPanel />
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
