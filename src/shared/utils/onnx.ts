import * as ort from 'onnxruntime-web';
import { getDB } from './idb';
import { detectBackend } from './backend-detector';

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

  const db = await getDB();
  const entry = await db.get('modelCache', modelId);
  if (!entry || !entry.modelBlob) {
    return null;
  }

  const arrayBuffer = await entry.modelBlob.arrayBuffer();
  const backend = detectBackend();
  const executionProviders = backend === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'];

  try {
    const session = await ort.InferenceSession.create(arrayBuffer, {
      executionProviders,
    });
    sessionCache.set(modelId, session);
    return session;
  } catch (err) {
    console.warn(`Failed to create ONNX session with [${executionProviders.join(', ')}], falling back to wasm:`, err);
    try {
      const fallbackSession = await ort.InferenceSession.create(arrayBuffer, {
        executionProviders: ['wasm'],
      });
      sessionCache.set(modelId, fallbackSession);
      return fallbackSession;
    } catch (fallbackErr) {
      console.error(`Failed to load ONNX session for ${modelId}:`, fallbackErr);
      throw fallbackErr;
    }
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
