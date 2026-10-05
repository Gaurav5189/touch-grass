import { useState, useCallback } from 'react';
import { getDB } from '../../../shared/utils/idb';

export interface ModelDownloadHook {
  progress: number;
  downloading: boolean;
  installed: boolean;
  error: string | null;
  startDownload: (url?: string, id?: string, version?: string, sizeBytes?: number) => Promise<void>;
}

export function useModelDownload(): ModelDownloadHook {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startDownload = useCallback(async (url: string = 'https://huggingface.co/justinchuby/BirdNET-onnx/resolve/main/model.onnx', id: string = 'birdnet-v1', version: string = '1.0', sizeBytes: number = 20971520) => {
    setDownloading(true);
    setProgress(0);
    setError(null);
    setInstalled(false);

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok && !response.body) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body not readable');
      }

      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedLength += value.byteLength;
          const pct = Math.min(100, Math.round((receivedLength / (sizeBytes || receivedLength || 1)) * 100));
          setProgress(pct);
        }
      }

      const blob = new Blob(chunks as any);

      const db = await getDB();
      await db.put('modelCache', {
        id,
        url,
        version,
        downloadedAt: Date.now(),
        sizeBytes: blob.size || sizeBytes,
      });

      setInstalled(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  }, []);

  return { progress, downloading, installed, error, startDownload };
}
