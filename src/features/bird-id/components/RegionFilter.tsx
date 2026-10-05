import { useState } from 'react';

const REGIONS = [
  { id: 'na-east', label: 'North America (East)' },
  { id: 'na-west', label: 'North America (West)' },
  { id: 'europe', label: 'Europe' },
  { id: 'australia', label: 'Australia' },
  { id: 'global', label: 'Global' },
];

export function RegionFilter({ selected, onSelect }: { selected?: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {REGIONS.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            selected === r.id
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]'
          }`}
          aria-pressed={selected === r.id}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
