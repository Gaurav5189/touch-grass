import { useState, useEffect, useCallback } from 'react';
import { getDB, ModelCacheEntry } from '../../../shared/utils/idb';
import { ModelInfo } from '../types';

export function useModelManager() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    const db = await getDB();
    const all = await db.getAll('modelCache');
    const ids = new Set(all.map((m) => m.id));
    setInstalledIds(ids);

    // Load registry (hard-coded for demo; in production from JSON)
    const registry: ModelInfo[] = [
      {
        id: 'birdnet-onnx',
        name: 'BirdNET-ONNX',
        url: 'https://example.com/models/birdnet.onnx',
        sizeBytes: 20_000_000,
        version: '1.0.0',
        region: 'Global',
        installed: ids.has('birdnet-onnx'),
        license: 'Apache-2.0',
      },
      {
        id: 'mobilenet-plants',
        name: 'MobileNetV3 Plants',
        url: 'https://example.com/models/plants.onnx',
        sizeBytes: 5_000_000,
        version: '0.9.1',
        region: 'Global',
        installed: ids.has('mobilenet-plants'),
        license: 'Apache-2.0',
      },
    ];
    setModels(registry.map((m) => ({ ...m, installed: ids.has(m.id) })));
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
