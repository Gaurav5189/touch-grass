import { Settings } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { BackendSelector } from './BackendSelector';
import { AboutDialog } from './AboutDialog';
import { useSettings } from '../hooks/useSettings';

export function SettingsPanel() {
  const { settings, save } = useSettings();
  const [aboutOpen, setAboutOpen] = useState(false);
  const s = settings || { backend: 'webgpu', confidenceThreshold: 0.5, autoSave: true, id: 'default', themeMode: 'auto', region: 'Global' };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Settings className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="text-base font-semibold">Settings</h3>
      </div>

      <section aria-label="Theme settings">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Appearance</h4>
        <ThemeToggle />
      </section>

      <section aria-label="Backend settings">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Performance</h4>
        <BackendSelector value={s.backend} onChange={(backend) => save({ backend })} />
      </section>

      <section aria-label="Inference settings">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Inference</h4>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <label htmlFor="confidence-threshold" className="block text-sm font-medium mb-2">
            Confidence Threshold: {Math.round(s.confidenceThreshold * 100)}%
          </label>
          <input
            id="confidence-threshold"
            type="range"
            min={0.1}
            max={0.99}
            step={0.01}
            value={s.confidenceThreshold}
            onChange={(e) => save({ confidenceThreshold: Number(e.target.value) })}
            className="w-full accent-[var(--primary)]"
            aria-valuenow={s.confidenceThreshold}
            aria-valuemin={0.1}
            aria-valuemax={0.99}
          />
        </div>
      </section>

      <section aria-label="Auto-save settings">
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm">
          <div>
            <h4 className="text-sm font-medium">Auto-save observations</h4>
            <p className="text-xs text-[var(--text-muted)]">Save after every identification</p>
          </div>
          <button
            onClick={() => save({ autoSave: !s.autoSave })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${s.autoSave ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
            aria-pressed={s.autoSave}
            aria-label="Toggle auto-save"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${s.autoSave ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </section>

      <section aria-label="About">
        <button
          onClick={() => setAboutOpen(true)}
          className="w-full text-left rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm hover:border-[var(--primary)] transition-colors text-sm font-medium text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          About & Licenses
        </button>
        <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </section>
    </div>
  );
}
