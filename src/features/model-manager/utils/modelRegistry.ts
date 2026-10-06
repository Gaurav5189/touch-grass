import { ModelInfo } from '../types';

export const MODEL_REGISTRY: ModelInfo[] = [
  {
    id: 'birdnet-v1',
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
    name: 'MobileNetV2 Plants & Insects',
    url: 'https://media.githubusercontent.com/media/onnx/models/main/validated/vision/classification/mobilenet/model/mobilenetv2-7.onnx',
    sizeBytes: 4_956_208,
    version: '0.9.1',
    region: 'Global',
    installed: false,
    license: 'Apache-2.0',
  },
];
