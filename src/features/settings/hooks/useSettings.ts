import { useState, useEffect, useCallback } from 'react';
import { getDB } from '../../../shared/utils/idb';
import { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  id: 'default',
  themeMode: 'auto',
  backend: 'webgpu',
  confidenceThreshold: 0.5,
  autoSave: true,
  region: 'Global',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const db = await getDB();
      const entry = await db.get('settings', 'default');
      if (entry) {
        setSettings(entry);
      } else {
        setSettings(DEFAULT_SETTINGS);
        await db.put('settings', DEFAULT_SETTINGS);
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoaded(true);
    }
  }, []);

  const save = useCallback(async (partial: Partial<Settings>) => {
    const updated = { ...settings, ...partial, id: 'default' };
    setSettings(updated);
    try {
      const db = await getDB();
      await db.put('settings', updated);
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    load();
  }, [load]);

  return { settings, loaded, save, load };
}
