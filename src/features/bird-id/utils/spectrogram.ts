export async function computeMelSpectrogram(audioBuffer: AudioBuffer, sampleRate = 48000): Promise<Float32Array[]> {
  const frameLength = 2048;
  const hopLength = 512;
  const numMelBins = 64;

  const channelData = audioBuffer.getChannelData(0);
  const frames = Math.floor((channelData.length - frameLength) / hopLength);
  const melFrames: Float32Array[] = [];

  for (let i = 0; i < frames; i++) {
    const start = i * hopLength;
    const frame = channelData.slice(start, start + frameLength);

    // Simplified mel energy approximation (stub for full mel filterbank)
    const energy = frame.reduce((sum, v) => sum + v * v, 0) / frameLength;
    const melEnergy = Math.log1p(energy) / Math.log(2);

    const melFrame = new Float32Array(numMelBins);
    melFrame[i % numMelBins] = melEnergy;
    melFrames.push(melFrame);
  }
  return melFrames;
}
