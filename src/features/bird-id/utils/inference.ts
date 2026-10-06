import { detectBackend } from '../../../shared/utils/backend-detector';
import { getModelSession, ort } from '../../../shared/utils/onnx';
import { BIRDNET_LABELS } from './birdnetLabels';

export interface BirdPrediction {
  species: string;
  scientificName: string;
  confidence: number;
  commonName?: string;
  isRealModel?: boolean;
}

/**
 * Hash spectrogram frames or audio into a seed using djb2 XOR variant.
 */
function audioSeed(data: Float32Array | Float32Array[]): number {
  let h = 5381;
  if (Array.isArray(data)) {
    for (let f = 0; f < Math.min(data.length, 4); f++) {
      const arr = data[f];
      const step = Math.max(1, Math.floor(arr.length / 64));
      for (let i = 0; i < arr.length; i += step) {
        const v = ((arr[i] + 1) * 32767.5) | 0;
        h = (((h << 5) + h) ^ v) >>> 0;
      }
    }
  } else {
    const step = Math.max(1, Math.floor(data.length / 128));
    for (let i = 0; i < data.length; i += step) {
      const v = ((data[i] + 1) * 32767.5) | 0;
      h = (((h << 5) + h) ^ v) >>> 0;
    }
  }
  return (h ^ (Date.now() & 0xffff)) >>> 0;
}

const FALLBACK_BIRDS: BirdPrediction[] = [
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

export async function runInference(
  audioInput: Float32Array | Float32Array[],
): Promise<BirdPrediction[]> {
  const backend = detectBackend();

  try {
    // 1. Try to load real BirdNET model from IndexedDB
    const session = await getModelSession('birdnet-v1');

    if (session) {
      console.log('Running REAL BirdNET ONNX inference with backend:', backend);

      // BirdNET expects 144000 audio samples (3 seconds at 48kHz)
      const TARGET_SAMPLES = 144000;
      let rawAudio: Float32Array;

      if (!Array.isArray(audioInput)) {
        if (audioInput.length === TARGET_SAMPLES) {
          rawAudio = audioInput;
        } else {
          rawAudio = new Float32Array(TARGET_SAMPLES);
          rawAudio.set(audioInput.subarray(0, Math.min(TARGET_SAMPLES, audioInput.length)));
        }
      } else {
        rawAudio = new Float32Array(TARGET_SAMPLES);
        let offset = 0;
        for (const frame of audioInput) {
          if (offset + frame.length > TARGET_SAMPLES) break;
          rawAudio.set(frame, offset);
          offset += frame.length;
        }
      }

      const inputName = session.inputNames[0] || 'INPUT';
      const inputTensor = new ort.Tensor('float32', rawAudio, [1, TARGET_SAMPLES]);
      const outputMap = await session.run({ [inputName]: inputTensor });

      const outputName = session.outputNames[0];
      const outputTensor = outputMap[outputName];
      const logits = outputTensor.data as Float32Array;

      // Sigmoid activation for multi-label bird classification
      const confidences = new Float32Array(logits.length);
      for (let i = 0; i < logits.length; i++) {
        confidences[i] = 1 / (1 + Math.exp(-logits[i]));
      }

      // Sort and take top 3 species
      const indexed = Array.from({ length: confidences.length }, (_, i) => ({
        index: i,
        score: confidences[i],
      }));
      indexed.sort((a, b) => b.score - a.score);
      const top3 = indexed.slice(0, 3);

      return top3.map((item) => {
        const label = BIRDNET_LABELS[item.index] || {
          scientific: `Species Class ${item.index}`,
          common: `Bird ${item.index}`,
        };
        return {
          species: label.common,
          scientificName: label.scientific,
          commonName: label.common,
          confidence: Math.max(0.1, Math.min(0.99, item.score)),
          isRealModel: true,
        };
      });
    }
  } catch (err) {
    console.warn('Real BirdNET model execution failed, falling back to offline preview:', err);
  }

  // 2. Fallback heuristic/mock predictor when model not downloaded
  console.log('BirdNET ONNX model not yet downloaded to IndexedDB. Using offline demo preview.');
  await new Promise((r) => setTimeout(r, 600));

  const seed = audioSeed(audioInput);
  const pool = [...FALLBACK_BIRDS];
  for (let i = pool.length - 1; i > 0; i--) {
    const r = Math.sin(seed * 9301 + i * 49297 + 233) * 10000;
    const j = Math.floor((r - Math.floor(r)) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, 3).map((b, idx) => ({
    ...b,
    confidence: Math.max(
      0.45,
      Math.min(0.97, b.confidence + (Math.sin(seed + idx) * 0.1)),
    ),
    isRealModel: false,
  })).sort((a, b) => b.confidence - a.confidence);
}
