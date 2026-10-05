/**
 * Resize an image to 224x224, normalize pixels, and return a Float32Array tensor.
 */
export function preprocessImage(imageSource: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context for image preprocessing');
  }
  ctx.drawImage(imageSource, 0, 0, 224, 224);
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const data = imageData.data; // RGBA array
  const floatArray = new Float32Array(224 * 224 * 3); // RGB only

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255.0;
    const g = data[i + 1] / 255.0;
    const b = data[i + 2] / 255.0;
    const pixelIndex = Math.floor(i / 4);
    floatArray[pixelIndex * 3] = r;
    floatArray[pixelIndex * 3 + 1] = g;
    floatArray[pixelIndex * 3 + 2] = b;
  }

  return floatArray;
}

export function preprocessImageFromBlob(blob: Blob): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const tensor = preprocessImage(img);
        URL.revokeObjectURL(url);
        resolve(tensor);
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for preprocessing'));
    };
    img.src = url;
  });
}
