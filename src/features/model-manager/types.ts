export interface ModelInfo {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  version: string;
  region?: string;
  installed: boolean;
  license: string;
}
