import { useState, useCallback } from 'react';
import { PhotoResult } from '../types';

export interface PhotoInferenceHook {
  results: PhotoResult[] | null;
  isInferring: boolean;
  error: string | null;
  infer: (_tensor: Float32Array) => Promise<void>;
  reset: () => void;
}

export function usePhotoInference(): PhotoInferenceHook {
  const [results, setResults] = useState<PhotoResult[] | null>(null);
  const [isInferring, setIsInferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const infer = useCallback(async (_tensor: Float32Array) => {
    setError(null);
    setIsInferring(true);
    setResults(null);
    try {
      // Mock inference using MobileNetV3 stub
      await new Promise((r) => setTimeout(r, 600));
      const mockResults: PhotoResult[] = [
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
      ];
      setResults(mockResults);
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
