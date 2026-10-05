import { useTheme } from '../../../app/providers/ThemeProvider';
import { Settings } from 'lucide-react';

export function SettingsPanel() {
  const { state, setMode } = useTheme();
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="text-base font-semibold">Settings</h3>
      </div>
      <div className="flex gap-2">
        {(['light', 'dark', 'auto'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setMode(mode)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              state.mode === mode
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]'
            }`}
            aria-pressed={state.mode === mode}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
