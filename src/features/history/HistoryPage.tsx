import { useState, useMemo } from 'react';
import { Upload } from 'lucide-react';
import { useObservations } from './hooks/useObservations';
import { FilterBar } from './components/FilterBar';
import { ObservationList } from './components/ObservationList';
import { ObservationDetail } from './components/ObservationDetail';
import { ExportDialog } from './components/ExportDialog';
import { Observation } from './types';

export function HistoryPage() {
  const { observations, loading, error, deleteObservation } = useObservations();
  const [selected, setSelected] = useState<Observation | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  interface FilterState {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
    speciesQuery?: string;
  }
  const [filters, setFilters] = useState<FilterState>({});

  const filtered = useMemo(() => {
    return observations.filter((o) => {
      if (filters.type && o.type !== filters.type) return false;
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom);
        from.setHours(0, 0, 0, 0);
        if (o.timestamp < from.getTime()) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setHours(23, 59, 59, 999);
        if (o.timestamp > to.getTime()) return false;
      }
      if (filters.speciesQuery) {
        const q = filters.speciesQuery.toLowerCase();
        if (!o.species.toLowerCase().includes(q) && !o.scientificName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [observations, filters]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Observation History</h2>
        <button
          onClick={() => setExportOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label="Export observations"
        >
          <Upload className="w-4 h-4" aria-hidden="true" /> Export
        </button>
      </div>

      <p className="text-sm text-[var(--text-muted)]">Your observations are saved locally. Nothing leaves your device.</p>

      <FilterBar observations={observations} filters={filters} onChange={setFilters} />

      {loading && <p className="text-sm text-[var(--text-muted)]">Loading observations...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!selected ? (
        <ObservationList observations={filtered} onSelect={setSelected} onDelete={deleteObservation} />
      ) : (
        <ObservationDetail observation={selected} onBack={() => setSelected(null)} />
      )}

      <ExportDialog observations={observations} open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
