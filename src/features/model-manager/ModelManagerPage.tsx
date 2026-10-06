import { useState } from 'react';
import { useModelDownload } from './hooks/useModelDownload';
import { useModelManager } from './hooks/useModelManager';
import { ModelList } from './components/ModelList';
import { CustomModelUploader } from './components/CustomModelUploader';
import { Database } from 'lucide-react';
import { getDB } from '../../shared/utils/idb';

export function ModelManagerPage() {
  const { models, refresh } = useModelManager();
  const downloadHook = useModelDownload();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>({});
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});

  const handleDownload = async (url: string, id: string, version: string, sizeBytes: number) => {
    setProgressMap((prev) => ({ ...prev, [id]: 0 }));
    setDownloadingMap((prev) => ({ ...prev, [id]: true }));
    setInstalledMap((prev) => ({ ...prev, [id]: false }));
    setErrorMap((prev) => ({ ...prev, [id]: null }));

    const start = () => {
      setProgressMap((prev) => ({ ...prev, [id]: downloadHook.progress }));
      setDownloadingMap((prev) => ({ ...prev, [id]: downloadHook.downloading }));
      setInstalledMap((prev) => ({ ...prev, [id]: downloadHook.installed }));
      setErrorMap((prev) => ({ ...prev, [id]: downloadHook.error }));
    };

    // Poll progress
    const interval = setInterval(start, 200);
    try {
      await downloadHook.startDownload(url, id, version, sizeBytes);
    } finally {
      clearInterval(interval);
      start();
    }

    await refresh();
  };

  const handleRemove = async (id: string) => {
    try {
      const db = await getDB();
      await db.delete('modelCache', id);
      await refresh();
    } catch {
      // ignore
    }
  };

  const handleCustomUpload = async (file: File, metadata: { id: string; name: string; version: string }) => {
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
