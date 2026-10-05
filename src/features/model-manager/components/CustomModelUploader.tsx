import { useState, useCallback, ChangeEvent } from 'react';
import { Upload, FileWarning, CheckCircle2 } from 'lucide-react';
import { modelValidation } from '../utils/modelValidation';

export interface CustomModelUploaderProps {
  onUpload: (file: File, metadata: { id: string; name: string; version: string }) => Promise<void>;
}

export function CustomModelUploader({ onUpload }: CustomModelUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setValidated(false);
    setValidationError(null);
    setValidating(true);

    try {
      await modelValidation.validateOnnxFile(f);
      setValidated(true);
    } catch (e: unknown) {
      setValidationError(e instanceof Error ? e.message : 'Invalid model file');
    } finally {
      setValidating(false);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleUpload = async () => {
    if (!file || !validated) return;
    await onUpload(file, {
      id: file.name.replace(/\.onnx$/i, ''),
      name: file.name,
      version: 'custom',
    });
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${dragActive ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border)] bg-[var(--surface)]'}`}
      aria-label="Custom model upload area"
    >
      <Upload className="w-8 h-8 mx-auto mb-3 text-[var(--primary)]" aria-hidden="true" />
      <h3 className="text-sm font-semibold mb-1">Upload Custom ONNX Model</h3>
      <p className="text-xs text-[var(--text-muted)] mb-4">Drag and drop a .onnx file, or click to browse</p>

      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--primary)] text-white hover:bg-[#145a1a] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]" aria-label="Browse for model file">
        <input type="file" accept=".onnx" className="hidden" onChange={handleChange} aria-hidden="true" />
        Browse
      </label>

      {file && (
        <div className="mt-4 text-left rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-[var(--text)]">{file.name}</span>
            {validated && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" aria-label="Valid" />}
            {!validated && validationError && <FileWarning className="w-4 h-4 text-red-600" aria-label="Invalid" />}
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          {validating && <p className="text-xs text-[var(--text-muted)]">Validating ONNX structure...</p>}
          {validationError && <p className="text-xs text-red-600" role="alert">{validationError}</p>}
          {validated && (
            <button
              onClick={handleUpload}
              className="mt-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--primary)] text-white hover:bg-[#145a1a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Upload validated model"
            >
              Upload
            </button>
          )}
        </div>
      )}
    </div>
  );
}
