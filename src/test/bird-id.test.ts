import { describe, it, expect } from 'vitest';
import { runInference } from '../features/bird-id/utils/inference';

describe('runInference (mock)', () => {
  it('returns sorted predictions', async () => {
    const results = await runInference([]);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].confidence).toBeGreaterThanOrEqual(results[results.length - 1].confidence);
    expect(typeof results[0].species).toBe('string');
  });

  it('includes scientific name', async () => {
    const results = await runInference([]);
    expect(results[0].scientificName).toContain(' ');
  });
});
