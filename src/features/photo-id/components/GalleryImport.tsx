import { useRef, useState, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface GalleryImportProps {
  onImport?: (blob: Blob, previewUrl: string) => void;
}

export function GalleryImport({ onImport }: GalleryImportProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImport?.(file, url);
    },
    [onImport]
  );

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
      <div className="flex flex-col items-center gap-2">
        <ImageIcon className="w-10 h-10 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="font-bold text-lg">Gallery Import</h3>
        <p className="text-sm text-[var(--text-muted)]">Select an image from your device.</p>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] aspect-video">
        {previewUrl ? (
          <img src={previewUrl} alt="Imported preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--bg)]">
            <ImageIcon className="w-12 h-12 text-[var(--text-muted)] opacity-40" aria-hidden="true" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Select image file"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        aria-label="Import photo from gallery"
      >
        Import Photo
      </button>
    </div>
  );
}
