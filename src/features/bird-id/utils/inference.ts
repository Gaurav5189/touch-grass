import { detectBackend } from '../../../shared/utils/backend-detector';

export interface BirdPrediction {
  species: string;
  scientificName: string;
  confidence: number;
  commonName?: string;
}

export async function runInference(_spectrogramFrames: Float32Array[]): Promise<BirdPrediction[]> {
  const backend = detectBackend();
  console.log('Running inference with backend:', backend);

  // Mock/stub inference (Phase 1 uses stub model per user instruction)
  await new Promise((r) => setTimeout(r, 800)); // Simulate <3s inference

  const mockResults: BirdPrediction[] = [
    { species: 'Northern Cardinal', scientificName: 'Cardinalis cardinalis', confidence: 0.92, commonName: 'Red Cardinal' },
    { species: 'American Robin', scientificName: 'Turdus migratorius', confidence: 0.78, commonName: 'Robin' },
    { species: 'Blue Jay', scientificName: 'Cyanocitta cristata', confidence: 0.61, commonName: 'Blue Jay' },
  ];

  return mockResults.sort((a, b) => b.confidence - a.confidence);
}
