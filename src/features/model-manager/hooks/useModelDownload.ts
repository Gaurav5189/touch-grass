import { useState, useCallback } from 'react';

export interface ModelDownloadHook {
  progress: number;
  downloading: boolean;
  installed: boolean;
  startDownload: () => Promise<void>;
}

export function useModelDownload(): ModelDownloadHook {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [installed, setInstalled] = useState(false);

  const startDownload = useCallback(async () => {
    setDownloading(true);
    setProgress(0);
    // Mock download: 20MB model with progress events
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 120));
      setProgress(p);
    }
    setInstalled(true);
    setDownloading(false);
  }, []);

  return { progress, downloading, installed, startDownload };
}
