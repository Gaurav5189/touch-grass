export interface BirdResult {
  species: string;
  scientificName: string;
  confidence: number;
  commonName?: string;
}

export interface BirdInferenceState {
  status: 'idle' | 'recording' | 'processing' | 'ready' | 'error';
  results?: BirdResult[];
  progress?: number;
  errorMessage?: string;
}
