import { useEffect, useState, useCallback } from 'react';
import { getDB } from '../../../shared/utils/idb';
import { Observation } from '../types';

export interface UseObservationsResult {
  observations: Observation[];
  loading: boolean;
  error: string | null;
  addObservation: (o: Omit<Observation, 'id' | 'timestamp'> & Partial<Pick<Observation, 'id' | 'timestamp'>>) => Promise<string>;
  deleteObservation: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useObservations(): UseObservationsResult {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDB();
      const all = await db.getAllFromIndex('observations', 'by-timestamp');
      const sorted = [...all].sort((a, b) => b.timestamp - a.timestamp);
      setObservations(sorted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load observations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addObservation = useCallback(
    async (o: Omit<Observation, 'id' | 'timestamp'> & Partial<Pick<Observation, 'id' | 'timestamp'>>) => {
      const db = await getDB();
      const record: Observation = {
        id: o.id || crypto.randomUUID(),
        timestamp: o.timestamp || Date.now(),
        ...o,
      } as Observation;
      await db.put('observations', record);
      await refresh();
      return record.id;
    },
    [refresh]
  );

  const deleteObservation = useCallback(
    async (id: string) => {
      const db = await getDB();
      await db.delete('observations', id);
      await refresh();
    },
    [refresh]
  );

  return { observations, loading, error, addObservation, deleteObservation, refresh };
}
