import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeProvider';

export function ThemeToggle() {
  const { state, setMode } = useTheme();

  const modes = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'auto', label: 'Auto', icon: Monitor },
  ] as const;

  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Theme mode">
      {modes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setMode(key)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
            state.mode === key
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]'
          }`}
          aria-pressed={state.mode === key}
          aria-label={`${label} theme`}
          role="radio"
          aria-checked={state.mode === key}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
