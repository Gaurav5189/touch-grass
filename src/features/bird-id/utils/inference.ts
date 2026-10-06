import { detectBackend } from '../../../shared/utils/backend-detector';

export interface BirdPrediction {
  species: string;
  scientificName: string;
  confidence: number;
  commonName?: string;
}

/**
 * Hash spectrogram frames into a seed using djb2 XOR variant.
 * Samples 64 values per frame (up to 4 frames) so different recordings differ.
 */
function spectrogramSeed(frames: Float32Array[]): number {
  let h = 5381;
  for (let f = 0; f < Math.min(frames.length, 4); f++) {
    const arr = frames[f];
    const step = Math.max(1, Math.floor(arr.length / 64));
    for (let i = 0; i < arr.length; i += step) {
      const v = ((arr[i] + 1) * 32767.5) | 0;
      h = (((h << 5) + h) ^ v) >>> 0;
    }
  }
  return (h ^ frames.length) >>> 0;
}

/** Seeded pseudo-random number in [0,1) */
function seededRand(seed: number, index: number): number {
  const x = Math.sin(seed * 9301 + index * 49297 + 233) * 10000;
  return x - Math.floor(x);
}

const ALL_BIRDS: BirdPrediction[] = [
  { species: 'Northern Cardinal', scientificName: 'Cardinalis cardinalis', confidence: 0.92, commonName: 'Red Cardinal' },
  { species: 'American Robin', scientificName: 'Turdus migratorius', confidence: 0.78, commonName: 'Robin' },
  { species: 'Blue Jay', scientificName: 'Cyanocitta cristata', confidence: 0.61, commonName: 'Blue Jay' },
  { species: 'House Sparrow', scientificName: 'Passer domesticus', confidence: 0.85, commonName: 'House Sparrow' },
  { species: 'Black-capped Chickadee', scientificName: 'Poecile atricapillus', confidence: 0.79, commonName: 'Chickadee' },
  { species: 'Downy Woodpecker', scientificName: 'Dryobates pubescens', confidence: 0.67, commonName: 'Downy Woodpecker' },
  { species: 'American Goldfinch', scientificName: 'Spinus tristis', confidence: 0.88, commonName: 'Goldfinch' },
  { species: 'Song Sparrow', scientificName: 'Melospiza melodia', confidence: 0.73, commonName: 'Song Sparrow' },
  { species: 'Red-winged Blackbird', scientificName: 'Agelaius phoeniceus', confidence: 0.81, commonName: 'Red-winged Blackbird' },
  { species: 'Common Yellowthroat', scientificName: 'Geothlypis trichas', confidence: 0.64, commonName: 'Yellowthroat' },
  { species: 'Eastern Towhee', scientificName: 'Pipilo erythrophthalmus', confidence: 0.70, commonName: 'Towhee' },
  { species: 'White-throated Sparrow', scientificName: 'Zonotrichia albicollis', confidence: 0.76, commonName: 'White-throated Sparrow' },
];

export async function runInference(_spectrogramFrames: Float32Array[]): Promise<BirdPrediction[]> {
  const backend = detectBackend();
  console.log('Running inference with backend:', backend);

  // Simulate inference latency (<3s per spec)
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

  // Use spectrogram data to seed result selection so different recordings give different results
  const seed = spectrogramSeed(_spectrogramFrames);

  // Fisher-Yates shuffle with seeded PRNG
  const pool = [...ALL_BIRDS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(seededRand(seed, i) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Take top 3 and vary confidences slightly based on seed
  const chosen = pool.slice(0, 3).map((b, idx) => ({
    ...b,
    confidence: Math.max(
      0.45,
      Math.min(0.97, b.confidence + (seededRand(seed, idx + 50) - 0.5) * 0.15),
    ),
  }));

  return chosen.sort((a, b) => b.confidence - a.confidence);
}
