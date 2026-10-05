export function detectBackend(): 'webgpu' | 'wasm' {
  if (typeof navigator === 'undefined') return 'wasm';
  if (navigator.gpu && 'getPreferredCanvasFormat' in navigator.gpu) {
    return 'webgpu';
  }
  return 'wasm';
}
