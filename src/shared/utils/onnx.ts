import * as ort from 'onnxruntime-web';
import { getDB } from './idb';
import { detectBackend } from './backend-detector';
import { MODEL_REGISTRY } from '../../features/model-manager/utils/modelRegistry';

// Configure ONNX Runtime to use jsdelivr CDN for wasm files with single thread for web/mobile compatibility
if (typeof window !== 'undefined') {
  ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.0/dist/';
  ort.env.wasm.numThreads = 1;
}

const sessionCache = new Map<string, ort.InferenceSession>();

export async function getModelSession(modelId: string): Promise<ort.InferenceSession | null> {
  if (sessionCache.has(modelId)) {
    return sessionCache.get(modelId)!;
  }

  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return null;
  }

  try {
    const db = await getDB();
    const entry = await db.get('modelCache', modelId);
    let blob: Blob | null = entry?.modelBlob instanceof Blob ? entry.modelBlob : null;

    // If entry exists without modelBlob (from older version) or missing from cache,
    // automatically fetch and cache it so real inference works seamlessly.
    if (!blob) {
      const registryItem = MODEL_REGISTRY.find((m) => m.id === modelId);
      const downloadUrl = registryItem?.url || entry?.url;
      if (downloadUrl && typeof fetch !== 'undefined') {
        try {
          console.log(`Model blob missing for ${modelId}; fetching from ${downloadUrl}...`);
          const res = await fetch(downloadUrl);
          if (res.ok) {
            blob = await res.blob();
            await db.put('modelCache', {
              id: modelId,
              url: downloadUrl,
              version: registryItem?.version || entry?.version || '1.0',
              downloadedAt: Date.now(),
              sizeBytes: blob.size,
              modelBlob: blob,
            });
            console.log(`Saved ${modelId} blob (${(blob.size / (1024 * 1024)).toFixed(1)} MB) to IndexedDB.`);
          }
        } catch (fetchErr) {
          console.warn(`Could not auto-fetch model ${modelId}:`, fetchErr);
        }
      }
    }

    if (!blob) {
      return null;
    }

    const arrayBuffer = await blob.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const backend = detectBackend();
    const executionProviders = backend === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'];

    try {
      const session = await ort.InferenceSession.create(uint8, {
        executionProviders,
      });
      sessionCache.set(modelId, session);
      return session;
    } catch (err) {
      console.warn(`Failed to create ONNX session with [${executionProviders.join(', ')}], falling back to wasm:`, err);
      try {
        const fallbackSession = await ort.InferenceSession.create(uint8, {
          executionProviders: ['wasm'],
        });
        sessionCache.set(modelId, fallbackSession);
        return fallbackSession;
      } catch (fallbackErr) {
        console.error(`Failed to load ONNX session for ${modelId}:`, fallbackErr);
        return null;
      }
    }
  } catch (err) {
    console.error('getModelSession unexpected error:', err);
    return null;
  }
}

export function clearModelSession(modelId?: string): void {
  if (modelId) {
    sessionCache.delete(modelId);
  } else {
    sessionCache.clear();
  }
}

export { ort };
