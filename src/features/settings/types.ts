export interface Settings {
  id: string;
  themeMode: 'light' | 'dark' | 'auto';
  backend: 'webgpu' | 'wasm';
  confidenceThreshold: number;
  autoSave: boolean;
  region?: string;
}
