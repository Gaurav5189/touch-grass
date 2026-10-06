import { useState, useCallback } from 'react';
import { PhotoResult } from '../types';

export interface PhotoInferenceHook {
  results: PhotoResult[] | null;
  isInferring: boolean;
  error: string | null;
  infer: (_tensor: Float32Array) => Promise<void>;
  reset: () => void;
}

/** 
 * Hash tensor pixel data into a seed.
 * Samples 64 evenly-spaced floats, maps each to a 16-bit integer,
 * and chains with djb2 so visually different images give different seeds.
 */
function tensorSeed(tensor: Float32Array): number {
  let h = 5381;
  const step = Math.max(1, Math.floor(tensor.length / 64));
  for (let i = 0; i < tensor.length; i += step) {
    // Scale to 0-65535 range to preserve fractional differences
    const v = ((tensor[i] + 1) * 32767.5) | 0;
    h = (((h << 5) + h) ^ v) >>> 0; // djb2 XOR variant
  }
  // XOR in length so even same-content tensors of different sizes differ
  return (h ^ tensor.length) >>> 0;
}

/** Seeded pseudo-random number in [0,1) */
function seededRand(seed: number, index: number): number {
  const x = Math.sin(seed * 9301 + index * 49297 + 233) * 10000;
  return x - Math.floor(x);
}

const ALL_RESULTS: PhotoResult[] = [
  {
    species: 'Common Milkweed',
    scientificName: 'Asclepias syriaca',
    confidence: 0.94,
    description: 'A perennial herb with broad oval leaves and clusters of fragrant pink flowers.',
    similar: ['Butterfly Weed', 'Swamp Milkweed'],
  },
  {
    species: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    confidence: 0.87,
    description: 'A large butterfly with bright orange wings marked with black veins and white spots.',
    similar: ['Viceroy', 'Queen Butterfly'],
  },
  {
    species: 'Honey Bee',
    scientificName: 'Apis mellifera',
    confidence: 0.72,
    description: 'A social flying insect known for pollination and honey production.',
    similar: ['Bumblebee', 'Carpenter Bee'],
  },
  {
    species: 'Dandelion',
    scientificName: 'Taraxacum officinale',
    confidence: 0.65,
    description: 'A widespread perennial with bright yellow flowers and deeply toothed leaves.',
    similar: ['Catsear', 'Hawkbit'],
  },
  {
    species: 'Green Lacewing',
    scientificName: 'Chrysoperla carnea',
    confidence: 0.58,
    description: 'A delicate green insect with large transparent wings; larvae are voracious predators.',
    similar: ['Brown Lacewing', 'Antlion'],
  },
  {
    species: 'Eastern Tiger Swallowtail',
    scientificName: 'Papilio glaucus',
    confidence: 0.89,
    description: 'A large yellow butterfly with bold black tiger stripes on its wings.',
    similar: ['Canadian Tiger Swallowtail', 'Two-tailed Swallowtail'],
  },
  {
    species: 'Black-eyed Susan',
    scientificName: 'Rudbeckia hirta',
    confidence: 0.81,
    description: 'Bright yellow daisy-like flowers with distinctive dark brown centers.',
    similar: ['Common Sunflower', 'Coneflower'],
  },
  {
    species: 'Ladybug',
    scientificName: 'Coccinella septempunctata',
    confidence: 0.76,
    description: 'A small round beetle with red wing covers spotted with black dots.',
    similar: ['Asian Lady Beetle', 'Convergent Lady Beetle'],
  },
  {
    species: 'Wild Bergamot',
    scientificName: 'Monarda fistulosa',
    confidence: 0.69,
    description: 'A native wildflower with clusters of lavender-pink tubular flowers.',
    similar: ['Bee Balm', 'Horsemint'],
  },
  {
    species: 'Painted Lady',
    scientificName: 'Vanessa cardui',
    confidence: 0.83,
    description: 'A medium-sized butterfly with orange and black patterned wings and white spots.',
    similar: ['American Lady', 'West Coast Lady'],
  },
];

export function usePhotoInference(): PhotoInferenceHook {
  const [results, setResults] = useState<PhotoResult[] | null>(null);
  const [isInferring, setIsInferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const infer = useCallback(async (tensor: Float32Array) => {
    setError(null);
    setIsInferring(true);
    setResults(null);
    try {
      // Simulate inference latency
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

      // Seed from image content XOR'd with timestamp — different images AND retries vary
      const seed = (tensorSeed(tensor) ^ (Date.now() & 0xffff)) >>> 0;

      // Fisher-Yates shuffle with seeded PRNG
      const pool = [...ALL_RESULTS];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(seededRand(seed, i) * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      // Take top 5 and vary confidences slightly based on seed
      const chosen = pool.slice(0, 5).map((r, idx) => ({
        ...r,
        confidence: Math.max(
          0.5,
          Math.min(0.98, r.confidence + (seededRand(seed, idx + 100) - 0.5) * 0.15),
        ),
      }));

      // Sort descending by confidence
      chosen.sort((a, b) => b.confidence - a.confidence);

      setResults(chosen);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Inference failed');
    } finally {
      setIsInferring(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setIsInferring(false);
    setError(null);
  }, []);

  return { results, isInferring, error, infer, reset };
}
