import { useState, useCallback, useEffect } from 'react';
import { getDB } from '../../../shared/utils/idb';

export interface ModelDownloadHook {
  progress: number;
  downloading: boolean;
  installed: boolean;
  error: string | null;
  startDownload: (url?: string, id?: string, version?: string, sizeBytes?: number) => Promise<void>;
}

export function useModelDownload(defaultModelId: string = 'birdnet-v1'): ModelDownloadHook {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getDB()
      .then((db) => db.get('modelCache', defaultModelId))
      .then((entry) => {
        if (mounted && entry) {
          setInstalled(true);
        }
      })
      .catch((err) => {
        console.warn('Failed to check model cache on mount:', err);
      });
    return () => {
      mounted = false;
    };
  }, [defaultModelId]);

  const startDownload = useCallback(
    async (
      url: string = 'https://huggingface.co/justinchuby/BirdNET-onnx/resolve/main/model.onnx',
      id: string = defaultModelId,
      version: string = '1.0',
      sizeBytes: number = 20971520
    ) => {
      setDownloading(true);
      setProgress(0);
      setError(null);
      setInstalled(false);

      try {
        const response = await fetch(url, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body not readable');
        }

        const headerLength = response.headers.get('content-length');
        const totalExpected = headerLength ? parseInt(headerLength, 10) : sizeBytes;

        let receivedLength = 0;
        const chunks: Uint8Array[] = [];
        let isDone = false;

        while (!isDone) {
          const { done, value } = await reader.read();
          if (done) {
            isDone = true;
            break;
          }
          if (value) {
            chunks.push(value);
            receivedLength += value.byteLength;
            const pct = Math.min(100, Math.round((receivedLength / (totalExpected || receivedLength || 1)) * 100));
            setProgress(pct);
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
          modelBlob: blob,
        });

        setInstalled(true);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Download failed');
      } finally {
        setDownloading(false);
      }
    },
    [defaultModelId]
  );

  return { progress, downloading, installed, error, startDownload };
}
