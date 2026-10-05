import { Search } from 'lucide-react';
import { Observation } from '../types';

export interface FilterBarProps {
  observations: Observation[];
  filters: {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
    speciesQuery?: string;
  };
  onChange: (filters: FilterBarProps['filters']) => void;
}

export function FilterBar({ observations, filters, onChange }: FilterBarProps) {
  const types = Array.from(new Set(observations.map((o) => o.type))).sort();

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-3" aria-label="Observation filters">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[10rem]">
          <label htmlFor="date-from" className="text-xs font-medium text-[var(--text-muted)] block mb-1">From</label>
          <input
            id="date-from"
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          />
        </div>
        <div className="flex-1 min-w-[10rem]">
          <label htmlFor="date-to" className="text-xs font-medium text-[var(--text-muted)] block mb-1">To</label>
          <input
            id="date-to"
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[10rem]">
          <label htmlFor="filter-type" className="text-xs font-medium text-[var(--text-muted)] block mb-1">Type</label>
          <select
            id="filter-type"
            value={filters.type || ''}
            onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <option value="">All</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex-[2] min-w-[14rem]">
          <label htmlFor="species-search" className="text-xs font-medium text-[var(--text-muted)] block mb-1">Search species</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              id="species-search"
              type="text"
              placeholder="Species or scientific name..."
              value={filters.speciesQuery || ''}
              onChange={(e) => onChange({ ...filters, speciesQuery: e.target.value || undefined })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] pl-9 pr-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
