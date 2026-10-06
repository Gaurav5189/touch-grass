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
  const numPixels = 224 * 224;
  const floatArray = new Float32Array(3 * numPixels); // NCHW: [1, 3, 224, 224]

  // ImageNet normalization constants: mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225]
  for (let i = 0; i < numPixels; i++) {
    const r = data[i * 4] / 255.0;
    const g = data[i * 4 + 1] / 255.0;
    const b = data[i * 4 + 2] / 255.0;

    floatArray[i] = (r - 0.485) / 0.229; // Red channel
    floatArray[numPixels + i] = (g - 0.456) / 0.224; // Green channel
    floatArray[2 * numPixels + i] = (b - 0.406) / 0.225; // Blue channel
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
