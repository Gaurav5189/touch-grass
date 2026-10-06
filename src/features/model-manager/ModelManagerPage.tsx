import { useState, useCallback } from 'react';
import { useModelManager } from './hooks/useModelManager';
import { ModelList } from './components/ModelList';
import { CustomModelUploader } from './components/CustomModelUploader';
import { Database } from 'lucide-react';
import { getDB } from '../../shared/utils/idb';

interface ModelState {
  progress: number;
  downloading: boolean;
  error: string | null;
}

export function ModelManagerPage() {
  const { models, refresh } = useModelManager();

  // Per-model download state — keyed by model id
  const [modelStates, setModelStates] = useState<Record<string, ModelState>>({});

  const setModelState = useCallback((id: string, update: Partial<ModelState>) => {
    setModelStates((prev) => ({
      ...prev,
      [id]: { ...{ progress: 0, downloading: false, error: null }, ...prev[id], ...update },
    }));
  }, []);

  const handleDownload = useCallback(
    async (url: string, id: string, version: string, sizeBytes: number) => {
      setModelState(id, { downloading: true, progress: 0, error: null });

      try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Response body not readable');

        const headerLength = response.headers.get('content-length');
        const totalExpected = headerLength ? parseInt(headerLength, 10) : sizeBytes;

        let receivedLength = 0;
        const chunks: Uint8Array[] = [];
        let lastPct = 0;

        let reading = true;
        while (reading) {
          const { done, value } = await reader.read();
          if (done) { reading = false; break; }
          if (value) {
            chunks.push(value);
            receivedLength += value.byteLength;
            const pct = Math.min(
              99,
              Math.round((receivedLength / (totalExpected || receivedLength || 1)) * 100),
            );
            // Only update if changed by at least 1% to avoid render thrash
            if (pct !== lastPct) {
              lastPct = pct;
              setModelState(id, { downloading: true, progress: pct });
            }
          }
        }

        const blob = new Blob(chunks as unknown as BlobPart[]);
        const db = await getDB();
        await db.put('modelCache', {
          id,
          url,
          version,
          downloadedAt: Date.now(),
          sizeBytes: blob.size || totalExpected,
        });

        setModelState(id, { downloading: false, progress: 100 });
        await refresh();
      } catch (e: unknown) {
        setModelState(id, {
          downloading: false,
          progress: 0,
          error: e instanceof Error ? e.message : 'Download failed',
        });
      }
    },
    [setModelState, refresh],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      try {
        const db = await getDB();
        await db.delete('modelCache', id);
        // Clear any cached download state for this model
        setModelStates((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        await refresh();
      } catch {
        // ignore
      }
    },
    [refresh],
  );

  const handleCustomUpload = async (
    file: File,
    metadata: { id: string; name: string; version: string },
  ) => {
    const db = await getDB();
    await db.put('modelCache', {
      id: metadata.id,
      url: file.name,
      version: metadata.version,
      downloadedAt: Date.now(),
      sizeBytes: file.size,
    });
    await refresh();
  };

  // Build maps from per-model state + useModelManager installed truth
  const progressMap: Record<string, number> = {};
  const downloadingMap: Record<string, boolean> = {};
  const installedMap: Record<string, boolean> = {};
  const errorMap: Record<string, string | null> = {};

  for (const model of models) {
    const s = modelStates[model.id];
    progressMap[model.id] = s?.downloading ? s.progress : model.installed ? 100 : 0;
    downloadingMap[model.id] = s?.downloading ?? false;
    // model.installed is the IDB source-of-truth from useModelManager
    installedMap[model.id] = model.installed;
    errorMap[model.id] = s?.error ?? null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Database className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
        <h2 className="text-2xl font-bold">Model Manager</h2>
      </div>

      <CustomModelUploader onUpload={handleCustomUpload} />

      <ModelList
        models={models}
        progressMap={progressMap}
        downloadingMap={downloadingMap}
        installedMap={installedMap}
        errorMap={errorMap}
        onDownload={handleDownload}
        onRemove={handleRemove}
      />
    </div>
  );
}
