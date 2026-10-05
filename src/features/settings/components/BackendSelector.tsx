import { Cpu } from 'lucide-react';
import { detectBackend } from '../../../shared/utils/backend-detector';
import { useState, useEffect } from 'react';

export interface BackendSelectorProps {
  value: 'webgpu' | 'wasm';
  onChange: (backend: 'webgpu' | 'wasm') => void;
}

export function BackendSelector({ value, onChange }: BackendSelectorProps) {
  const [preferred, setPreferred] = useState<'webgpu' | 'wasm'>('wasm');

  useEffect(() => {
    setPreferred(detectBackend());
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Cpu className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="text-base font-semibold">Inference Backend</h3>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-4">WebGPU is preferred for faster inference. WASM provides broader device support.</p>
      <div className="flex gap-3">
        {[
          { key: 'webgpu' as const, label: 'WebGPU', desc: 'Preferred' },
          { key: 'wasm' as const, label: 'WASM', desc: 'Fallback' },
        ].map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 rounded-xl border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
              value === key
                ? 'bg-[var(--primary-light)] border-[var(--primary)]'
                : 'bg-[var(--bg)] border-[var(--border)] hover:border-[var(--primary)]'
            }`}
            aria-pressed={value === key}
          >
            <div className="text-sm font-semibold text-[var(--text)]">{label}</div>
            <div className="text-xs text-[var(--text-muted)]">{desc} {key === preferred ? '(Detected)' : ''}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
