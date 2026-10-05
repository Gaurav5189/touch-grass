import { beforeAll, afterEach, vi } from 'vitest';

beforeAll(() => {
  (global.navigator as unknown as Record<string, unknown>).mediaDevices = {
    getUserMedia: vi.fn(async () => ({}) as unknown as MediaStream),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});
