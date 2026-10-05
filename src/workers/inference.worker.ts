import { InferenceSession, Tensor } from 'onnxruntime-web';

interface InferenceMessage {
  type: 'inference';
  modelUrl: string;
  inputData: number[];
}

self.onmessage = async (e: MessageEvent<InferenceMessage>) => {
  const { type, modelUrl, inputData } = e.data;
  if (type !== 'inference') return;

  try {
    const session = await InferenceSession.create(modelUrl, {
      executionProviders: ['webgpu', 'wasm'],
    });
    const inputTensor = new Tensor('float32', Float32Array.from(inputData), [1, 1, 64, 1]);
    const results = await session.run({ input: inputTensor });
    const output = Array.from(results.output.data as Float32Array);
    self.postMessage({ ok: true, predictions: output.slice(0, 5) });
  } catch (err: unknown) {
    self.postMessage({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
