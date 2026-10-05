import { useCallback, useRef, useState } from 'react';

export interface AudioChunk {
  blob: Blob;
  durationMs: number;
  timestamp: number;
}

export interface AudioRecorderHook {
  isRecording: boolean;
  chunks: AudioChunk[];
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => void;
  permission: 'prompt' | 'granted' | 'denied';
}

export function useAudioRecorder(durationMs = 3000): AudioRecorderHook {
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState<AudioChunk[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 48000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      streamRef.current = stream;
      setPermission('granted');

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = recorder;
      const chunkList: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunkList.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunkList, { type: 'audio/webm' });
        setChunks((prev) => [
          ...prev,
          { blob, durationMs: Math.round(chunkList.length * 100), timestamp: Date.now() },
        ]);
      };

      recorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
        setIsRecording(false);
      }, durationMs);
    } catch (e: unknown) {
      setPermission('denied');
      setError(e instanceof Error ? e.message : 'Microphone access denied');
    }
  }, [durationMs]);

  const stop = useCallback(async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const reset = useCallback(() => {
    setChunks([]);
    setError(null);
  }, []);

  return { isRecording, chunks, error, start, stop, reset, permission };
}
