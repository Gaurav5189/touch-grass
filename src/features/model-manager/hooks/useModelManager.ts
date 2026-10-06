import { useState, useEffect, useCallback } from 'react';
import { getDB, ModelCacheEntry } from '../../../shared/utils/idb';
import { ModelInfo } from '../types';
import { MODEL_REGISTRY } from '../utils/modelRegistry';

export function useModelManager() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    const db = await getDB();
    const all = await db.getAll('modelCache');
    const ids = new Set(all.map((m) => m.id));
    setInstalledIds(ids);

    setModels(MODEL_REGISTRY.map((m) => ({ ...m, installed: ids.has(m.id) })));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getInstalled = useCallback(async (): Promise<ModelCacheEntry[]> => {
    const db = await getDB();
    return db.getAll('modelCache');
  }, []);

  return { models, installedIds, refresh, getInstalled };
}
