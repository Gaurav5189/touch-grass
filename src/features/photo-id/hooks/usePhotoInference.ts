import { useState, useCallback } from 'react';
import { PhotoResult } from '../types';
import { getModelSession, ort } from '../../../shared/utils/onnx';
import { IMAGENET_LABELS } from '../utils/imagenetLabels';

export interface PhotoInferenceHook {
  results: PhotoResult[] | null;
  isInferring: boolean;
  isStub: boolean;
  error: string | null;
  infer: (tensor: Float32Array) => Promise<void>;
  reset: () => void;
}

/** Fallback species list when model has not been downloaded yet */
const FALLBACK_SPECIES: PhotoResult[] = [
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

function getFallbackResults(tensor: Float32Array): PhotoResult[] {
  let h = 5381;
  const step = Math.max(1, Math.floor(tensor.length / 64));
  for (let i = 0; i < tensor.length; i += step) {
    const v = ((tensor[i] + 1) * 32767.5) | 0;
    h = (((h << 5) + h) ^ v) >>> 0;
  }
  const seed = (h ^ (Date.now() & 0xffff)) >>> 0;

  const pool = [...FALLBACK_SPECIES];
  for (let i = pool.length - 1; i > 0; i--) {
    const r = Math.sin(seed * 9301 + i * 49297 + 233) * 10000;
    const j = Math.floor((r - Math.floor(r)) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, 5).map((item, idx) => {
    const noise = Math.sin(seed + idx) * 0.08;
    return {
      ...item,
      confidence: Math.max(0.5, Math.min(0.97, item.confidence + noise)),
    };
  }).sort((a, b) => b.confidence - a.confidence);
}

export function usePhotoInference(): PhotoInferenceHook {
  const [results, setResults] = useState<PhotoResult[] | null>(null);
  const [isInferring, setIsInferring] = useState(false);
  const [isStub, setIsStub] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const infer = useCallback(async (tensor: Float32Array) => {
    setError(null);
    setIsInferring(true);
    setResults(null);

    try {
      // 1. Check if on-device model is available in IndexedDB
      const session = await getModelSession('mobilenet-plants-v1');

      if (session) {
        // Run Real ONNX inference
        console.log('Running REAL ONNX model inference for image...');
        const inputName = session.inputNames[0] || 'data';
        const inputTensor = new ort.Tensor('float32', tensor, [1, 3, 224, 224]);
        const outputMap = await session.run({ [inputName]: inputTensor });

        const outputName = session.outputNames[0];
        const outputTensor = outputMap[outputName];
        const logits = outputTensor.data as Float32Array;

        // Compute numerically stable Softmax
        let maxLogit = -Infinity;
        for (let i = 0; i < logits.length; i++) {
          if (logits[i] > maxLogit) maxLogit = logits[i];
        }

        let sumExp = 0;
        const expScores = new Float32Array(logits.length);
        for (let i = 0; i < logits.length; i++) {
          expScores[i] = Math.exp(logits[i] - maxLogit);
          sumExp += expScores[i];
        }

        const probabilities = new Float32Array(logits.length);
        for (let i = 0; i < logits.length; i++) {
          probabilities[i] = expScores[i] / (sumExp || 1);
        }

        // Get Top 5 Predictions
        const indexed = Array.from({ length: probabilities.length }, (_, i) => ({
          index: i,
          score: probabilities[i],
        }));
        indexed.sort((a, b) => b.score - a.score);
        const top5 = indexed.slice(0, 5);

        const realResults: PhotoResult[] = top5.map((item) => {
          const label = IMAGENET_LABELS[item.index] || {
            name: `Species ${item.index}`,
            synsetId: `class-${item.index}`,
          };
          return {
            species: label.name,
            scientificName: `${label.synsetId} • ${label.name}`,
            confidence: Math.max(0.1, Math.min(0.99, item.score)),
            description: `Classified via on-device MobileNet neural network.`,
            similar: top5
              .filter((t) => t.index !== item.index)
              .slice(0, 2)
              .map((t) => IMAGENET_LABELS[t.index]?.name || `Class ${t.index}`),
          };
        });

        setIsStub(false);
        setResults(realResults);
      } else {
        // Fallback demo mode when model is not yet downloaded
        console.log('MobileNet ONNX model not yet downloaded to IndexedDB. Using offline demo preview.');
        await new Promise((r) => setTimeout(r, 600));
        setIsStub(true);
        setResults(getFallbackResults(tensor));
      }
    } catch (e: unknown) {
      console.error('Inference execution error:', e);
      setError(e instanceof Error ? e.message : 'Inference failed');
    } finally {
      setIsInferring(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setIsInferring(false);
    setIsStub(false);
    setError(null);
  }, []);

  return { results, isInferring, isStub, error, infer, reset };
}
