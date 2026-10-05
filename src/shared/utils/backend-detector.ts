export function detectBackend(): 'webgpu' | 'wasm' {
  if (typeof navigator === 'undefined') return 'wasm';
  const nav = navigator as Navigator & { gpu?: { getPreferredCanvasFormat?: () => string } };
  if (nav.gpu && typeof nav.gpu.getPreferredCanvasFormat === 'function') {
    return 'webgpu';
  }
  return 'wasm';
}
