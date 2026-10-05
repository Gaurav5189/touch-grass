import { ModelInfo } from '../types';

export const MODEL_REGISTRY: ModelInfo[] = [
  {
    id: 'birdnet-onnx-v1',
    name: 'BirdNET-ONNX',
    url: 'https://huggingface.co/justinchuby/BirdNET-onnx/resolve/main/model.onnx',
    sizeBytes: 20_000_000,
    version: '1.0.0',
    region: 'Global',
    installed: false,
    license: 'Apache-2.0',
  },
  {
    id: 'mobilenet-plants-v1',
    name: 'MobileNetV3 Plants',
    url: 'https://example.com/models/plants-v1.onnx',
    sizeBytes: 5_000_000,
    version: '0.9.1',
    region: 'Global',
    installed: false,
    license: 'Apache-2.0',
  },
];
