import { ModelInfo } from '../types';
import { ModelCard } from './ModelCard';

export interface ModelListProps {
  models: ModelInfo[];
  progressMap: Record<string, number>;
  downloadingMap: Record<string, boolean>;
  installedMap: Record<string, boolean>;
  errorMap: Record<string, string | null>;
  onDownload: (url: string, id: string, version: string, sizeBytes: number) => Promise<void>;
  onRemove?: (id: string) => Promise<void>;
}

export function ModelList({ models, progressMap, downloadingMap, installedMap, errorMap, onDownload, onRemove }: ModelListProps) {
  return (
    <section aria-label="Installed and available models">
      <div className="grid gap-4">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            progress={progressMap[model.id] ?? 0}
            downloading={downloadingMap[model.id] ?? false}
            installed={installedMap[model.id] ?? model.installed}
            error={errorMap[model.id] ?? null}
            onDownload={onDownload}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}
